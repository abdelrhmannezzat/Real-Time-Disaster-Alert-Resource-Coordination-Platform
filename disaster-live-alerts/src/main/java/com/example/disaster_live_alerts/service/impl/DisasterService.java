package com.example.disaster_live_alerts.service.impl;

import com.example.disaster_live_alerts.dto.DisasterCreateRequestDto;
import com.example.disaster_live_alerts.dto.DisasterCreateResponseDto;
import com.example.disaster_live_alerts.dto.DisasterNearbyResponseDto;
import com.example.disaster_live_alerts.dto.LocationDto;
import com.example.disaster_live_alerts.enums.DisasterSeverity;
import com.example.disaster_live_alerts.enums.DisasterSource;
import com.example.disaster_live_alerts.enums.DisasterType;
import com.example.disaster_live_alerts.model.Disaster;
import com.example.disaster_live_alerts.model.Location;
import com.example.disaster_live_alerts.model.User;
import com.example.disaster_live_alerts.repo.DisasterRepository;
import com.example.disaster_live_alerts.security.CustomUserDetails;
import com.example.disaster_live_alerts.service.IDisasterService;
import com.example.disaster_live_alerts.service.ILocationService;
import com.example.disaster_live_alerts.service.IUserService;
import jakarta.transaction.Transactional;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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
    public Page<DisasterNearbyResponseDto> getNearbyDisasters(Double lat, Double lng, Double rad, DisasterSeverity sev, DisasterType typ, Pageable pageable) {
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

        Point point = geometryFactory.createPoint(
                new Coordinate(
                        lng,
                        lat
                )
        );


        return null;
    }
}
