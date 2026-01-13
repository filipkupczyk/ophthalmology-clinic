package com.opth.clinic.ophthalmology_backend.controller;

import com.opth.clinic.ophthalmology_backend.model.User;
import com.opth.clinic.ophthalmology_backend.dto.UserDto;
import com.opth.clinic.ophthalmology_backend.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers(Authentication auth) {
        return userService.getAllUsers(auth);
    }

    @PostMapping("/admin/create")
    public User addUserAdmin(@RequestBody User user, Authentication auth) {
        return userService.addUserAdmin(user, auth);
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id, Authentication auth) {
        return userService.getUserById(id, auth);
    }

    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody UserDto user, Authentication auth) {
        return userService.UpdateUser(id, user, auth);
    }

    @PostMapping("/create")
    public User createUser(@RequestBody User user, Authentication auth) {
        return userService.addUser(user, auth);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUserById(@PathVariable Long id, Authentication auth) {
        userService.deleteUserById(id, auth);
    }

}
