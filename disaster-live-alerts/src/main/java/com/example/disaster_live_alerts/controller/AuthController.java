package com.example.disaster_live_alerts.controller;


import com.example.disaster_live_alerts.dto.UserLoginDto;
import com.example.disaster_live_alerts.dto.UserRegistrationDto;
import com.example.disaster_live_alerts.service.IAuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/v1/auth")
public class AuthController {
    private final IAuthService authService;

    public AuthController(IAuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationDto userRegistrationDto) {
        var user = authService.createUser(userRegistrationDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginDto userLoginDto) {
        var user = authService.login(userLoginDto);
        return ResponseEntity.ok(user);
    }


}
