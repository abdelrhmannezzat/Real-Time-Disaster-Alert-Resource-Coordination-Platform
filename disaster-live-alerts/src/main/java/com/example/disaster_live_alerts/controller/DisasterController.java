package com.example.disaster_live_alerts.controller;

import com.example.disaster_live_alerts.dto.DisasterCreateRequestDto;
import com.example.disaster_live_alerts.dto.DisasterCreateResponseDto;
import com.example.disaster_live_alerts.dto.DisasterNearbyResponseDto;
import com.example.disaster_live_alerts.enums.DisasterSeverity;
import com.example.disaster_live_alerts.enums.DisasterType;
import com.example.disaster_live_alerts.service.IDisasterService;
import org.apache.coyote.Response;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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


    @GetMapping("/nearby")
    public ResponseEntity<Page<DisasterNearbyResponseDto>> getNearbyDisasters(
            @RequestParam(name = "lat") Double lat,
            @RequestParam(name = "lng") Double lng,
            @RequestParam(name = "rad", required = false, defaultValue = "50") Double rad,
            @RequestParam(name = "sev", required = false) DisasterSeverity sev,
            @RequestParam(name = "typ", required = false)DisasterType typ,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(disasterService.getNearbyDisasters(lat, lng, rad, sev, typ, pageable));
    }
}
