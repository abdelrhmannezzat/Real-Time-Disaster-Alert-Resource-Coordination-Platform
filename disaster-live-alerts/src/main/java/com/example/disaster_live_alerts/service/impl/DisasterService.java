package com.example.disaster_live_alerts.service.impl;

import com.example.disaster_live_alerts.dto.DisasterCreateRequestDto;
import com.example.disaster_live_alerts.dto.DisasterCreateResponseDto;
import com.example.disaster_live_alerts.dto.LocationDto;
import com.example.disaster_live_alerts.model.Disaster;
import com.example.disaster_live_alerts.model.Location;
import com.example.disaster_live_alerts.repo.DisasterRepository;
import com.example.disaster_live_alerts.service.IDisasterService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class DisasterService implements IDisasterService {
    private final DisasterRepository disasterRepository;
    private final ILocationService locationService;
    public DisasterService(DisasterRepository disasterRepository, ILocationService locationService) {
        this.disasterRepository = disasterRepository;
        this.locationService = locationService;
    }

    @Override
    @Transactional
    public DisasterCreateResponseDto createDisasterManually(DisasterCreateRequestDto disasterCreateRequestDto) {
        // TODO: Add the user id from the JWT to the Disaster when building

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
                        .severity(disasterCreateRequestDto.getSeverity())
                        .status(disasterCreateRequestDto.getStatus())
                        .startTime(disasterCreateRequestDto.getStartTime())
                        .endTime(disasterCreateRequestDto.getEndTime()).build();

        disasterRepository.save(disaster);

        return null;
    }
}
