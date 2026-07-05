package com.example.disaster_live_alerts.dto;

import com.example.disaster_live_alerts.enums.DisasterSeverity;
import com.example.disaster_live_alerts.enums.DisasterSource;
import com.example.disaster_live_alerts.enums.DisasterStatus;
import com.example.disaster_live_alerts.enums.DisasterType;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NormalizedDisasterDto {
    private String title;
    private String description;
    private DisasterType type;
    private DisasterSeverity severity;
    private DisasterSource source;
    private DisasterStatus status;
    private Double radius;
    @JsonAlias("external_id")
    private String externalId;
    @JsonAlias("start_time")
    private LocalDateTime startTime;
    private Double latitude;
    private Double longitude;
    private String city;
    private String country;


}
