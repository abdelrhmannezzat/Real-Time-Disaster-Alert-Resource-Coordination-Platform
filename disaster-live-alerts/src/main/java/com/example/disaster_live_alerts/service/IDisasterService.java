package com.example.disaster_live_alerts.service;

import com.example.disaster_live_alerts.dto.DisasterCreateRequestDto;
import com.example.disaster_live_alerts.dto.DisasterCreateResponseDto;

public interface IDisasterService {
    DisasterCreateResponseDto createDisasterManually(DisasterCreateRequestDto disasterCreateRequestDto);
}
