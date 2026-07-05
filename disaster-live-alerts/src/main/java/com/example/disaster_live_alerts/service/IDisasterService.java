package com.example.disaster_live_alerts.service;

import com.example.disaster_live_alerts.dto.*;
import com.example.disaster_live_alerts.enums.DisasterSeverity;
import com.example.disaster_live_alerts.enums.DisasterType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IDisasterService {
    DisasterCreateResponseDto createDisasterManually(DisasterCreateRequestDto disasterCreateRequestDto);

    Page<DisasterNearbyResponseDto> getNearbyDisasters(Double lat, Double lng, Double rad, DisasterSeverity sev, DisasterType typ, Pageable pageable);

    DisasterFetchResponseDto getDisaster(Long disasterId);

    void createDisasterFromThirdParty(NormalizedDisasterDto disaster);
}
