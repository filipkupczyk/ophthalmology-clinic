package com.opth.clinic.ophthalmology_backend.service;

import com.opth.clinic.ophthalmology_backend.dto.UserDto;
import com.opth.clinic.ophthalmology_backend.exception.NotFoundException;
import com.opth.clinic.ophthalmology_backend.model.User;
import com.opth.clinic.ophthalmology_backend.respository.UserRespository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    private final UserRespository userRespository;

    public UserService(UserRespository userRespository) {
        this.userRespository = userRespository;
    }

    public User getUserById(Long id) {
        return userRespository.findById(id).get();
    }

    public User addUser(User user) {
        return userRespository.save(user);
    }

    public User UpdateUser(Long id, UserDto user) {
        User existingUser = userRespository.findById(id).orElseThrow(() -> new NotFoundException("Nie znaleziono pacjenta"));
        if(user.getFirstName() != null) existingUser.setFirstName(user.getFirstName());
        if(user.getLastName() != null) existingUser.setLastName(user.getLastName());
        if(user.getEmail() != null) existingUser.setEmail(user.getEmail());
        return userRespository.save(existingUser);
    }

    public void deleteUserById(Long id) {
        userRespository.deleteById(id);
    }

    public List<User> getAllUsers() {
        return userRespository.findAll();
    }

}
