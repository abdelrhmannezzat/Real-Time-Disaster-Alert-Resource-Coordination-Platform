package com.example.disaster_live_alerts.AMQP;

import com.example.disaster_live_alerts.dto.AlertMessage;
import com.example.disaster_live_alerts.dto.NormalizedDisasterDto;
import com.example.disaster_live_alerts.service.IDisasterService;
import com.example.disaster_live_alerts.websocket.LiveAlertsWebSocketHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class AlertEventListener {

    private final LiveAlertsWebSocketHandler wsHandler;
    private final AlertPersistenceService alertPersistenceService;
    public AlertEventListener(LiveAlertsWebSocketHandler wsHandler, AlertPersistenceService alertPersistenceService) {
        this.wsHandler = wsHandler;
        this.alertPersistenceService = alertPersistenceService;
    }

    @RabbitListener(queues = "notification_queue")
    public void onAlert(NormalizedDisasterDto disaster) {
        // Save this alert message to the database
        alertPersistenceService.saveAlert(disaster);
        wsHandler.broadcastAlert(disaster, 100000.0);
    }

}