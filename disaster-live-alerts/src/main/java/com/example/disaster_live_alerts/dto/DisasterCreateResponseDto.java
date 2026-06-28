package com.example.disaster_live_alerts.dto;

import com.example.disaster_live_alerts.enums.DisasterSeverity;
import com.example.disaster_live_alerts.enums.DisasterStatus;
import com.example.disaster_live_alerts.enums.DisasterType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DisasterCreateResponseDto {
    private Long id;
    private String title;
    private String description;
    private DisasterType type;
    private DisasterSeverity severity;
    private DisasterStatus status;
    private Double radius;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
