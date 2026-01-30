package com.opth.clinic.ophthalmology_backend.service;

import com.opth.clinic.ophthalmology_backend.dto.UserDto;
import com.opth.clinic.ophthalmology_backend.exception.NotFoundException;
import com.opth.clinic.ophthalmology_backend.model.Doctor;
import com.opth.clinic.ophthalmology_backend.model.Role;
import com.opth.clinic.ophthalmology_backend.model.User;
import com.opth.clinic.ophthalmology_backend.respository.DoctorRespository;
import com.opth.clinic.ophthalmology_backend.respository.UserRespository;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class UserService {
    private final UserRespository userRespository;
    private final DoctorRespository doctorRespository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRespository userRespository,  PasswordEncoder passwordEncoder,  DoctorRespository doctorRespository) {
        this.userRespository = userRespository;
        this.passwordEncoder = passwordEncoder;
        this.doctorRespository = doctorRespository;
    }

    public User getUserById(Long id, Authentication auth) {
        String role = auth.getAuthorities().iterator().next().getAuthority();

        if (!role.equals("ROLE_ADMIN")) {
            throw new RuntimeException("You are not allowed to access this resource");
        }
        return userRespository.findById(id).get();
    }

    public User addUser(User user) {
        if (userRespository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email jest zajety");
        }
        User newUser = new User();
        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setRole(Role.PATIENT);
        return userRespository.save(newUser);
    }

    public User addUserAdmin(User user, Authentication auth) {
        String role = auth.getAuthorities().iterator().next().getAuthority();

        if (!role.equals("ROLE_ADMIN") && !role.equals("ROLE_SECRETARY")) {
            throw new RuntimeException("You are not allowed to access this resource");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRespository.save(user);
    }

    public User UpdateUser(Long id, UserDto user, Authentication auth) {
        String role = auth.getAuthorities().iterator().next().getAuthority();
        String email = auth.getName();

        User currentUser = userRespository.findByEmail(email).get();
        User targetUser = userRespository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));

        boolean isAdmin = role.equals("ROLE_ADMIN");
        boolean isEdditingSlf = currentUser.getId().equals(id);

        if (!isAdmin && !isEdditingSlf) {
            throw new RuntimeException("Możesz edytowac tylko swoj profil!");
        }
        User existingUser = userRespository.findById(id).orElseThrow(() -> new NotFoundException("Nie znaleziono pacjenta"));
        if(user.getFirstName() != null) existingUser.setFirstName(user.getFirstName());
        if(user.getLastName() != null) existingUser.setLastName(user.getLastName());
        if(user.getEmail() != null) existingUser.setEmail(user.getEmail());

        if (user.getRole() != null) {
            if (isAdmin) {
                targetUser.setRole(user.getRole());

                if (user.getRole() == Role.DOCTOR && user.getDoctor() != null) {
                    Doctor doctor = doctorRespository.findById(user.getDoctor().getId())
                            .orElseThrow(() -> new NotFoundException("Doctor not found"));
                    targetUser.setDoctor(doctor);
                } else if (user.getRole() != Role.DOCTOR) {
                    targetUser.setDoctor(null);
                }
            }
        }
        return userRespository.save(existingUser);
    }

    public void deleteUserById(Long id, Authentication auth) {
        String role = auth.getAuthorities().iterator().next().getAuthority();

        if (!role.equals("ROLE_ADMIN")) {
            throw new RuntimeException("You are not allowed to access this resource");
        }
        userRespository.deleteById(id);
    }

    public List<User> getAllUsers(Authentication auth) {
        String role = auth.getAuthorities().iterator().next().getAuthority();

        if (!role.equals("ROLE_ADMIN")) {
            throw new RuntimeException("You are not allowed to access this resource");
        }
        return userRespository.findAll();
    }

    public User getCurrentUser(Authentication auth) {
        return userRespository.findByEmail(auth.getName()).get();
    }

    public List<User> searchUsers(@RequestParam String firstName, @RequestParam String lastName, Authentication auth) {
        String role = auth.getAuthorities().iterator().next().getAuthority();
        if (!role.equals("ROLE_ADMIN")) {
            throw new RuntimeException("You are not allowed to access this resource");
        }
        Role patientRole = Role.PATIENT;
        boolean firstNameEmpty = firstName == null || firstName.trim().isEmpty();
        boolean lastNameEmpty = lastName == null || lastName.trim().isEmpty();

        if (firstNameEmpty && lastNameEmpty) {
            return Collections.emptyList();
        }

        if (!firstNameEmpty && !lastNameEmpty) {
            return userRespository.findByRoleAndFirstNameContainingIgnoreCaseAndLastNameContainingIgnoreCase(
                    patientRole, firstName, lastName);
        }

        if (!firstNameEmpty) {
            return userRespository.findByRoleAndFirstNameContainingIgnoreCase(patientRole, firstName);
        }

        return userRespository.findByRoleAndLastNameContainingIgnoreCase(patientRole, lastName);
    }

}
