package com.example.disaster_live_alerts.dto;


import com.example.disaster_live_alerts.enums.DisasterSeverity;
import com.example.disaster_live_alerts.enums.DisasterType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DisasterNearbyResponseDto {
    private Long id;
    private String title;
    private String description;
    private DisasterSeverity severity;
    private DisasterType type;
    private Double radius;
    private Double latitude;
    private Double longitude;
    private String city;
    private String country;
    private LocalDate startTime;
}
