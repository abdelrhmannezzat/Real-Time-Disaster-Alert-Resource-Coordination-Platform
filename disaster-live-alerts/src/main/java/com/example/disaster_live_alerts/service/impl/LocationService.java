package com.example.disaster_live_alerts.service.impl;

import com.example.disaster_live_alerts.dto.LocationDto;
import com.example.disaster_live_alerts.model.Location;
import com.example.disaster_live_alerts.repo.LocationRepository;
import com.example.disaster_live_alerts.service.ILocationService;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;

@Service
public class LocationService implements ILocationService {
    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public Location createLocation(LocationDto locationDto) {
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

        Point point = geometryFactory.createPoint(
                new Coordinate(
                        locationDto.getLongitude(),
                        locationDto.getLatitude()
                )
        );

        Location location =
                Location.builder()
                        .longitude(locationDto.getLongitude())
                        .latitude(locationDto.getLatitude())
                        .coordinates(point)
                        .city(locationDto.getCity())
                        .country(locationDto.getCountry()).build();

        return locationRepository.save(location);
    }
}
