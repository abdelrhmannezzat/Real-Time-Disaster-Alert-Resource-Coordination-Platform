package com.example.disaster_live_alerts.service.impl;

import com.example.disaster_live_alerts.dto.LocationDto;
import com.example.disaster_live_alerts.model.Location;
import com.example.disaster_live_alerts.repo.LocationRepository;
import org.springframework.stereotype.Service;

@Service
public class LocationService implements ILocationService{
    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public Location createLocation(LocationDto locationDto) {
        Location location =
                Location.builder()
                        .longitude(locationDto.getLongitude())
                        .latitude(locationDto.getLatitude())
                        .city(locationDto.getCity())
                        .country(locationDto.getCountry()).build();

        return locationRepository.save(location);
    }
}
