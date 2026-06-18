package com.example.disaster_live_alerts.service.impl;

import com.example.disaster_live_alerts.dto.UserLoginDto;
import com.example.disaster_live_alerts.dto.UserRegistrationDto;
import com.example.disaster_live_alerts.dto.UserResponseDto;
import com.example.disaster_live_alerts.service.IAuthService;
import com.example.disaster_live_alerts.service.IUserService;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements IAuthService {
    private final IUserService userService;

    public AuthService(IUserService userService) {
        this.userService = userService;
    }


    @Override
    public UserResponseDto createUser(UserRegistrationDto userRegistrationDto) {
        return userService.createUser(userRegistrationDto);
    }

    @Override
    public UserResponseDto login(UserLoginDto userLoginDto) {
        return userService.login(userLoginDto);
    }
}
