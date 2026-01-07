package com.opth.clinic.ophthalmology_backend.controller;

import com.opth.clinic.ophthalmology_backend.model.User;
import com.opth.clinic.ophthalmology_backend.dto.UserDto;
import com.opth.clinic.ophthalmology_backend.service.UserService;
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
    public List<User> getAllDoctors() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody UserDto user) {
        return userService.UpdateUser(id, user);
    }

    @PutMapping("/create")
    public User createUser(@RequestBody User user) {
        return userService.addUser(user);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUserById(@PathVariable Long id) {
        userService.deleteUserById(id);
    }

}
