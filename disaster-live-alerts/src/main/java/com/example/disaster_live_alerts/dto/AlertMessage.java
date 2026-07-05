package com.example.disaster_live_alerts.dto;

import com.example.disaster_live_alerts.enums.DisasterSeverity;
import com.example.disaster_live_alerts.enums.DisasterType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlertMessage {
    private String id;
    private String title;
    private String message;
    private DisasterSeverity severity;
    private Double latitude;
    private Double longitude;
    private Double distance;
    private DisasterType type;

}
