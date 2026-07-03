package com.example.disaster_live_alerts.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final LiveAlertsWebSocketHandler handler;
    private final AuthHandshakeInterceptor authInterceptor;

    public WebSocketConfig(LiveAlertsWebSocketHandler handler, AuthHandshakeInterceptor authInterceptor) {
        this.handler = handler;
        this.authInterceptor = authInterceptor;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(handler, "/v1/ws")
                .addInterceptors(authInterceptor)
                .setAllowedOrigins("http://localhost:5173");
    }
}