package com.example.disaster_live_alerts.service.impl;

import com.example.disaster_live_alerts.dto.*;
import com.example.disaster_live_alerts.exceptions.InvalidCredentials;
import com.example.disaster_live_alerts.exceptions.NoSuchUserExistsException;
import com.example.disaster_live_alerts.exceptions.UserAlreadyExistsException;
import com.example.disaster_live_alerts.exceptions.UserNotActiveException;
import com.example.disaster_live_alerts.model.User;
import com.example.disaster_live_alerts.repo.UserRepository;
import com.example.disaster_live_alerts.security.CustomUserDetails;
import com.example.disaster_live_alerts.security.services.JwtService;
import com.example.disaster_live_alerts.service.IUserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional
    public void activateUser(int userId) {
        userRepository.setIsActive(userId, true);
    }

    @Override
    @Transactional
    public void deactivateUser(int userId) {
        userRepository.setIsActive(userId, false);
    }

    @Override
    public UserResponseDto createUser(UserRegistrationDto userRegistrationDto) {
        // Check first if email already exists
        if (userRepository.existsByEmail(userRegistrationDto.getEmail()) != null) {
            throw new UserAlreadyExistsException(userRegistrationDto.getEmail());
        }
        User user = new User();
        user.setEmail(userRegistrationDto.getEmail());
        user.setPassword(this.passwordEncoder.encode(userRegistrationDto.getPassword()));
        user.setRole(userRegistrationDto.getRole());
        User savedUser = userRepository.save(user);
        return UserResponseDto.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .userRole(savedUser.getRole())
                .build();
    }

    @Override
    public UserLoginResponseDto login(UserLoginDto userLoginDto) {
        User user = userRepository.findByEmail(userLoginDto.getEmail())
                .orElseThrow(() -> new InvalidCredentials("Invalid email or password"));

        if (!passwordEncoder.matches(userLoginDto.getPassword(), user.getPassword())) {
            throw new InvalidCredentials("The email or password is incorrect");
        }

        if (!user.getIsActive()) {
            throw new UserNotActiveException("User is not active");
        }

        return UserLoginResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .accessToken(jwtService.generateToken(user))
                .type("bearer")
                .build();
    }

    @Override
    public Page<UserActivationDto> getUsersPaginated(Pageable pageable) {
        return userRepository.findAllPaginated(pageable);
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchUserExistsException("User not found"));
    }


}
