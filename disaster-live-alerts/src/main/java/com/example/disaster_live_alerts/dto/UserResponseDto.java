package com.example.disaster_live_alerts.dto;

import com.example.disaster_live_alerts.enums.UserRole;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponseDto {
    private Long id;
    private String email;
    private UserRole userRole;
}
