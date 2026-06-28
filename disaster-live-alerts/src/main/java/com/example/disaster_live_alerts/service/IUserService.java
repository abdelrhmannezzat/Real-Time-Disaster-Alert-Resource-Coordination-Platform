package com.example.disaster_live_alerts.service;

import com.example.disaster_live_alerts.dto.UserActivationDto;
import com.example.disaster_live_alerts.dto.UserLoginDto;
import com.example.disaster_live_alerts.dto.UserRegistrationDto;
import com.example.disaster_live_alerts.dto.UserResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IUserService {
    void activateUser(int userId);

    void deactivateUser(int userId);

    UserResponseDto createUser(UserRegistrationDto userRegistrationDto);

    UserResponseDto login(UserLoginDto userLoginDto);

    Page<UserActivationDto> getUsersPaginated(Pageable pageable);
}
