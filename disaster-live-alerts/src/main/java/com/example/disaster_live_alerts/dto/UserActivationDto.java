package com.example.disaster_live_alerts.dto;

import com.example.disaster_live_alerts.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserActivationDto {
    private Long id;
    private String email;
    private Boolean isActive;
    private UserRole userRole;
}
