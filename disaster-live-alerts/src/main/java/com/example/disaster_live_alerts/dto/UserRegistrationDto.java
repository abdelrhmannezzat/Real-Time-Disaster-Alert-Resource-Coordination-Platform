package com.example.disaster_live_alerts.dto;

import com.example.disaster_live_alerts.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserRegistrationDto {
    private String email;
    private String password;
    private UserRole userRole;
}
