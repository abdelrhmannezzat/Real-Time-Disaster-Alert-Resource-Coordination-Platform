package com.example.disaster_live_alerts.controller;


import com.example.disaster_live_alerts.dto.UserActivationDto;
import com.example.disaster_live_alerts.service.IUserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/v1/users")
public class UserController {
    private final IUserService userService;

    public UserController(IUserService userService) {
        this.userService = userService;
    }

    @PatchMapping("/{user_id}/activate")
    public ResponseEntity<?> activateUser(@PathVariable("user_id") int user_id) {
        userService.activateUser(user_id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{user_id}/deactivate")
    public ResponseEntity<?> deactivateUser(@PathVariable("user_id") int user_id) {
        userService.deactivateUser(user_id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("")
    public ResponseEntity<?> getUsersPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserActivationDto> users = userService.getUsersPaginated(pageable);
        return ResponseEntity.ok(users);
    }

}
