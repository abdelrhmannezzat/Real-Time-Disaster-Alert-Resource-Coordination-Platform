package com.example.disaster_live_alerts.websocket;

import com.example.disaster_live_alerts.dto.AlertMessage;
import com.example.disaster_live_alerts.dto.NormalizedDisasterDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LiveAlertsWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // session -> the user's location + userId, so we can filter/target
    private final Map<WebSocketSession, ClientContext> clients = new ConcurrentHashMap<>();

    private record ClientContext(Integer userId, double lat, double lng) {}

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        Map<String, Object> attributes = session.getAttributes();
        Integer userId = (Integer) attributes.get("userId");
        double lat = Double.parseDouble((String)attributes.get("lat"));
        double lng = Double.parseDouble((String) attributes.get("lng"));

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
    public void broadcastAlert(NormalizedDisasterDto disaster, @Value("${alerts.radius}") double radiusKm) {
        AlertMessage alert = new AlertMessage(
                disaster.getExternalId(),
                disaster.getTitle(),
                disaster.getDescription(),
                disaster.getSeverity(),
                disaster.getLatitude(),
                disaster.getLongitude(),
                0.0,
                disaster.getType()
        );
        for (Map.Entry<WebSocketSession, ClientContext> entry : clients.entrySet()) {
            WebSocketSession session = entry.getKey();
            ClientContext ctx = entry.getValue();

            if (!session.isOpen()) continue;

            if (alert.getLatitude() != null && alert.getLongitude() != null) {
                double dist = haversineKm(ctx.lat(), ctx.lng(), alert.getLatitude(), alert.getLongitude());
                if (dist > radiusKm) continue; // too far, skip this client

                // attach the per-client distance before sending
                alert.setDistance(dist);
            }

            sendJson(session, alert);
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
