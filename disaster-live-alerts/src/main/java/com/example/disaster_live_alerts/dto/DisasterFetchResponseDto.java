package com.example.disaster_live_alerts.dto;

import com.example.disaster_live_alerts.enums.DisasterSeverity;
import com.example.disaster_live_alerts.enums.DisasterSource;
import com.example.disaster_live_alerts.enums.DisasterStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DisasterFetchResponseDto {
    private Long id;
    private Long createdBy;
    private String title;
    private String description;
    private DisasterSeverity severity;
    private DisasterSource source;
    private DisasterStatus status;
    private Double radius;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String city;
    private String country;
}
