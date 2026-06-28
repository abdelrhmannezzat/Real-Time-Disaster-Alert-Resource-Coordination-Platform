package com.example.disaster_live_alerts.controller;

import com.example.disaster_live_alerts.dto.DisasterCreateRequestDto;
import com.example.disaster_live_alerts.dto.DisasterCreateResponseDto;
import com.example.disaster_live_alerts.service.IDisasterService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/v1/disasters")
public class DisasterController {
    private final IDisasterService disasterService;


    public DisasterController(IDisasterService disasterService) {
        this.disasterService = disasterService;
    }

    @PostMapping("")
    public ResponseEntity<DisasterCreateResponseDto> createDisasterManually(
            @RequestBody DisasterCreateRequestDto disasterCreateRequestDto){
        DisasterCreateResponseDto disaster = disasterService.createDisasterManually(disasterCreateRequestDto);
        return ResponseEntity.status(201).body(disaster);
    }
}
