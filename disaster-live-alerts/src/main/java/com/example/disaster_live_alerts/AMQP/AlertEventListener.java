package com.example.disaster_live_alerts.AMQP;

import com.example.disaster_live_alerts.dto.AlertMessage;
import com.example.disaster_live_alerts.websocket.LiveAlertsWebSocketHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class AlertEventListener {

    private final LiveAlertsWebSocketHandler wsHandler;

    public AlertEventListener(LiveAlertsWebSocketHandler wsHandler) {
        this.wsHandler = wsHandler;
    }

    @RabbitListener(queues = "notification_queue") // <-- see below for where this name comes from
    public void onAlert(AlertMessage alert) {
        wsHandler.broadcastAlert(alert, 100.0);
    }
}