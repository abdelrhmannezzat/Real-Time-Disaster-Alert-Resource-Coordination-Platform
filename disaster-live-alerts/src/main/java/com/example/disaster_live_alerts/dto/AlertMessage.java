package com.example.disaster_live_alerts.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlertMessage {
    private String title;
    private String message;
    private String severity;
    private Double latitude;
    private Double longitude;
    private Double distance;

}
