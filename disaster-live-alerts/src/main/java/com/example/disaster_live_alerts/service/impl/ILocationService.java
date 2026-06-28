package com.example.disaster_live_alerts.service.impl;

import com.example.disaster_live_alerts.dto.LocationDto;
import com.example.disaster_live_alerts.model.Location;

public interface ILocationService {
    Location createLocation(LocationDto locationDto);
}
