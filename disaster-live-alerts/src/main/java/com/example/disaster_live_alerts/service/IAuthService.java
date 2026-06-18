package com.example.disaster_live_alerts.service;

import com.example.disaster_live_alerts.dto.UserLoginDto;
import com.example.disaster_live_alerts.dto.UserRegistrationDto;
import com.example.disaster_live_alerts.dto.UserResponseDto;

public interface IAuthService {
    UserResponseDto createUser(UserRegistrationDto userRegistrationDto);

    UserResponseDto login(UserLoginDto userLoginDto);
}
