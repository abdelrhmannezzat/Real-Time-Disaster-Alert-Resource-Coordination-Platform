package com.example.disaster_live_alerts.websocket;

import com.example.disaster_live_alerts.dto.AlertMessage;
import com.example.disaster_live_alerts.security.services.JwtService;
import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LiveAlertsWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // session -> the user's location + userId, so we can filter/target
    private final Map<WebSocketSession, ClientContext> clients = new ConcurrentHashMap<>();
    private final JwtService jwtService;

    public LiveAlertsWebSocketHandler(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    private record ClientContext(Integer userId, double lat, double lng) {}

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        Map<String, String> params = parseQueryParams(session);

        String token = params.get("token");
        Integer userId = (Integer)jwtService.extractClaim(token, claims -> claims.get("user_id"));
        double lat = Double.parseDouble(params.getOrDefault("lat", "0"));
        double lng = Double.parseDouble(params.getOrDefault("lng", "0"));

        clients.put(session, new ClientContext(userId, lat, lng));
        System.out.println("Connected: " + session.getId() + " total=" + clients.size());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        clients.remove(session);
    }

    /**
     * Broadcasts to every connected client within radiusKm of the alert's location.
     * If the alert has no lat/lng, it goes to everyone.
     */
    public void broadcastAlert(AlertMessage alert, double radiusKm) {
        for (Map.Entry<WebSocketSession, ClientContext> entry : clients.entrySet()) {
            WebSocketSession session = entry.getKey();
            ClientContext ctx = entry.getValue();

            if (!session.isOpen()) continue;

            AlertMessage toSend = alert;

            if (alert.getLatitude() != null && alert.getLongitude() != null) {
                double dist = haversineKm(ctx.lat(), ctx.lng(), alert.getLatitude(), alert.getLongitude());
                if (dist > radiusKm) continue; // too far, skip this client

                // attach the per-client distance before sending
                toSend = new AlertMessage(
                        alert.getTitle(), alert.getMessage(), alert.getSeverity(),
                        alert.getLatitude(), alert.getLongitude(), dist
                );
            }

            sendJson(session, toSend);
        }
    }

    private void sendJson(WebSocketSession session, Object payload) {
        try {
            String json = objectMapper.writeValueAsString(payload);
            synchronized (session) {
                session.sendMessage(new TextMessage(json));
            }
        } catch (IOException e) {
            System.err.println("Failed to send to " + session.getId() + ": " + e.getMessage());
        }
    }

    private Map<String, String> parseQueryParams(WebSocketSession session) {
        Map<String, String> result = new HashMap<>();
        String query = session.getUri() != null ? session.getUri().getQuery() : null;
        if (query == null) return result;

        for (String pair : query.split("&")) {
            String[] kv = pair.split("=", 2);
            if (kv.length == 2) {
                result.put(URLDecoder.decode(kv[0], StandardCharsets.UTF_8),
                        URLDecoder.decode(kv[1], StandardCharsets.UTF_8));
            }
        }
        return result;
    }

    private double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371; // Earth radius km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
