package com.example.disaster_live_alerts.service.impl;

import com.example.disaster_live_alerts.dto.UserActivationDto;
import com.example.disaster_live_alerts.dto.UserLoginDto;
import com.example.disaster_live_alerts.dto.UserRegistrationDto;
import com.example.disaster_live_alerts.dto.UserResponseDto;
import com.example.disaster_live_alerts.exceptions.InvalidCredentials;
import com.example.disaster_live_alerts.exceptions.NoSuchUserExistsException;
import com.example.disaster_live_alerts.exceptions.UserAlreadyExistsException;
import com.example.disaster_live_alerts.exceptions.UserNotActiveException;
import com.example.disaster_live_alerts.model.User;
import com.example.disaster_live_alerts.repo.UserRepository;
import com.example.disaster_live_alerts.service.IUserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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
        // Check first if email already exists
        if (userRepository.existsByEmail(userRegistrationDto.getEmail()) != null) {
            throw new UserAlreadyExistsException(userRegistrationDto.getEmail());
        }
        User user = new User();
        user.setEmail(userRegistrationDto.getEmail());
        user.setPassword(this.passwordEncoder.encode(userRegistrationDto.getPassword()));
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
        //TODO: implement login logic using bcrypt + Spring Security + JWT
        User user = userRepository.findByEmail(userLoginDto.getEmail())
                .orElseThrow(() -> new InvalidCredentials("Invalid email or password"));

        if (!passwordEncoder.matches(user.getPassword(), userLoginDto.getPassword())) {
            throw new InvalidCredentials("The email or password is incorrect");
        }

        if (!user.getIsActive()) {
            throw new UserNotActiveException("User is not active");
        }

        return UserResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .userRole(user.getRole())
                .build();
    }

    @Override
    public Page<UserActivationDto> getUsersPaginated(Pageable pageable) {
        return userRepository.findAllPaginated(pageable);
    }


}
