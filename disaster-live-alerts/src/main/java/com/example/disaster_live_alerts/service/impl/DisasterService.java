package com.example.disaster_live_alerts.service.impl;

import com.example.disaster_live_alerts.dto.*;
import com.example.disaster_live_alerts.enums.DisasterSeverity;
import com.example.disaster_live_alerts.enums.DisasterSource;
import com.example.disaster_live_alerts.enums.DisasterType;
import com.example.disaster_live_alerts.model.Disaster;
import com.example.disaster_live_alerts.model.Location;
import com.example.disaster_live_alerts.repo.DisasterRepository;
import com.example.disaster_live_alerts.security.CustomUserDetails;
import com.example.disaster_live_alerts.service.IDisasterService;
import com.example.disaster_live_alerts.service.ILocationService;
import com.example.disaster_live_alerts.websocket.LiveAlertsWebSocketHandler;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class DisasterService implements IDisasterService {
    private final DisasterRepository disasterRepository;
    private final ILocationService locationService;
    private final LiveAlertsWebSocketHandler liveAlertsWebSocketHandler;

    public DisasterService(DisasterRepository disasterRepository, ILocationService locationService, LiveAlertsWebSocketHandler liveAlertsWebSocketHandler) {
        this.disasterRepository = disasterRepository;
        this.locationService = locationService;
        this.liveAlertsWebSocketHandler = liveAlertsWebSocketHandler;
    }

    @Override
    @Transactional
    public DisasterCreateResponseDto createDisasterManually(DisasterCreateRequestDto disasterCreateRequestDto) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        if (userDetails == null) {
            throw new RuntimeException("User Principal is null");
        }

        LocationDto locationDto =
                LocationDto.builder()
                        .longitude(disasterCreateRequestDto.getLongitude())
                        .latitude(disasterCreateRequestDto.getLatitude())
                        .country(disasterCreateRequestDto.getCountry())
                        .city(disasterCreateRequestDto.getCity()).build();

        Location loc = locationService.createLocation(locationDto);

        Disaster disaster =
                Disaster.builder()
                        .title(disasterCreateRequestDto.getTitle())
                        .description(disasterCreateRequestDto.getDescription())
                        .type(disasterCreateRequestDto.getType())
                        .location(loc)
                        .radius(disasterCreateRequestDto.getRadius())
                        .createdBy(userDetails.getCurrentUser())
                        .severity(disasterCreateRequestDto.getSeverity())
                        .status(disasterCreateRequestDto.getStatus())
                        .startTime(disasterCreateRequestDto.getStartTime())
                        .source(DisasterSource.MANUAL)
                        .endTime(disasterCreateRequestDto.getEndTime()).build();

        disasterRepository.save(disaster);

        NormalizedDisasterDto dto =
                new NormalizedDisasterDto(
                        disaster.getTitle(),
                        disaster.getDescription(),
                        disaster.getType(),
                        disaster.getSeverity(),
                        disaster.getSource(),
                        disaster.getStatus(),
                        disaster.getRadius(),
                        null,
                        disaster.getStartTime(),
                        locationDto.getLatitude(),
                        locationDto.getLongitude(),
                        locationDto.getCity(),
                        locationDto.getCountry()
                );

        liveAlertsWebSocketHandler.broadcastAlert(dto, 10000);

        return DisasterCreateResponseDto.builder()
                .id(disaster.getId())
                .title(disaster.getTitle())
                .description(disaster.getDescription())
                .type(disaster.getType())
                .severity(disaster.getSeverity())
                .status(disaster.getStatus())
                .radius(disaster.getRadius())
                .startTime(disaster.getStartTime())
                .endTime(disaster.getEndTime()).build();
    }

    @Override
    public Page<DisasterNearbyResponseDto> getNearbyDisasters(Double lat,
                                                              Double lng,
                                                              Double rad,
                                                              DisasterSeverity sev,
                                                              DisasterType typ,
                                                              Pageable pageable) {
        return disasterRepository.getNearbyDisasters(lat,lng, rad, sev, typ, pageable);
    }

    @Override
    public DisasterFetchResponseDto getDisaster(Long disasterId) {
        return disasterRepository.getDisasterById(disasterId)
                .orElseThrow(() -> new RuntimeException("Disaster not found"));
    }

    @Override
    @Transactional
    public void createDisasterFromThirdParty(NormalizedDisasterDto disasterDto) {
        if (disasterRepository.existsByExternalId(disasterDto.getExternalId())) {
            return;
        }
        LocationDto loc =
                LocationDto.builder()
                        .longitude(disasterDto.getLongitude())
                        .latitude(disasterDto.getLatitude())
                        .city(disasterDto.getCity())
                        .country(disasterDto.getCountry()).build();

        Location location = locationService.createLocation(loc);

        Disaster disaster =
                Disaster.builder()
                        .title(disasterDto.getTitle())
                        .description(disasterDto.getDescription())
                        .type(disasterDto.getType())
                        .severity(disasterDto.getSeverity())
                        .source(disasterDto.getSource())
                        .status(disasterDto.getStatus())
                        .radius(disasterDto.getRadius())
                        .externalId(disasterDto.getExternalId())
                        .startTime(disasterDto.getStartTime())
                        .location(location).build();

        disasterRepository.save(disaster);
    }
}
