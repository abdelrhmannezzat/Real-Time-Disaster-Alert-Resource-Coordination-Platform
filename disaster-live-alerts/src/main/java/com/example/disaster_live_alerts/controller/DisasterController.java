package com.example.disaster_live_alerts.controller;

import com.example.disaster_live_alerts.service.IDisasterService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/v1/disasters")
public class DisasterController {
    private final IDisasterService disasterService;


    public DisasterController(IDisasterService disasterService) {
        this.disasterService = disasterService;
    }


}
