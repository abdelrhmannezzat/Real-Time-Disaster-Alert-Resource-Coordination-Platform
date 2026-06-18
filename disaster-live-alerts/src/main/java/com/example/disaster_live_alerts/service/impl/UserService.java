package com.example.disaster_live_alerts.service.impl;

import com.example.disaster_live_alerts.dto.UserLoginDto;
import com.example.disaster_live_alerts.dto.UserRegistrationDto;
import com.example.disaster_live_alerts.dto.UserResponseDto;
import com.example.disaster_live_alerts.exceptions.UserAlreadyExistsException;
import com.example.disaster_live_alerts.model.User;
import com.example.disaster_live_alerts.repo.UserRepository;
import com.example.disaster_live_alerts.service.IUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService implements IUserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void activateUser(int userId) {
        userRepository.setIsActive(userId, true);
    }

    @Override
    public void deactivateUser(int userId) {
        userRepository.setIsActive(userId, false);
    }

    @Override
    public UserResponseDto createUser(UserRegistrationDto userRegistrationDto) {
        //TODO: implement register logic using bcrypt + Spring Security

        // Check first if email already exists
        if (userRepository.existsByEmail(userRegistrationDto.getEmail())) {
            throw new UserAlreadyExistsException(userRegistrationDto.getEmail());
        }
        User user = new User();
        user.setEmail(userRegistrationDto.getEmail());
        user.setPassword(userRegistrationDto.getPassword());
        user.setRole(userRegistrationDto.getUserRole());
        User savedUser = userRepository.save(user);
        return UserResponseDto.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .userRole(savedUser.getRole())
                .build();
    }

    @Override
    public UserResponseDto login(UserLoginDto userLoginDto) {
        //TODO: implement login logic using bcrypt + Spring Security
        return null;
    }
}
