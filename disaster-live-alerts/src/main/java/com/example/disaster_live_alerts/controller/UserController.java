package com.example.disaster_live_alerts.controller;


import com.example.disaster_live_alerts.service.IUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/v1/users")
public class UserController {
    private final IUserService IUserService;

    public UserController(IUserService IUserService) {
        this.IUserService = IUserService;
    }

    @PatchMapping("/{user_id}/activate")
    public ResponseEntity<?> activateUser(@PathVariable("user_id") int user_id) {
        IUserService.activateUser(user_id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{user_id}/deactivate")
    public ResponseEntity<?> deactivateUser(@PathVariable("user_id") int user_id) {
        IUserService.deactivateUser(user_id);
        return ResponseEntity.noContent().build();
    }

}
