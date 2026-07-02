package com.example.disaster_live_alerts.service;

import com.example.disaster_live_alerts.dto.*;
import com.example.disaster_live_alerts.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IUserService {
    void activateUser(int userId);

    void deactivateUser(int userId);

    UserResponseDto createUser(UserRegistrationDto userRegistrationDto);

    UserLoginResponseDto login(UserLoginDto userLoginDto);

    Page<UserActivationDto> getUsersPaginated(Pageable pageable);

    User getUserById(Long userId);
}
