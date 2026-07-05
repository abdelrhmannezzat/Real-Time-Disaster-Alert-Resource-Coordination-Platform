package com.example.disaster_live_alerts.AMQP;


import com.example.disaster_live_alerts.dto.NormalizedDisasterDto;
import com.example.disaster_live_alerts.service.IDisasterService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class AlertPersistenceService {

    private final IDisasterService disasterService;

    public AlertPersistenceService(IDisasterService disasterService) {
        this.disasterService = disasterService;
    }

    @Async("dbTaskExecutor")
    public void saveAlert(NormalizedDisasterDto disaster) {
        System.out.println("Saving on thread: " + Thread.currentThread().getName());
        disasterService.createDisasterFromThirdParty(disaster);
    }
}