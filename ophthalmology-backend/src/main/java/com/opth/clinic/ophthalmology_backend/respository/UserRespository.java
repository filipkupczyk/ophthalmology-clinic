package com.opth.clinic.ophthalmology_backend.respository;
import com.opth.clinic.ophthalmology_backend.model.Role;
import com.opth.clinic.ophthalmology_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRespository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User>findByRoleAndFirstNameContainingIgnoreCaseAndLastNameContainingIgnoreCase(Role role, String firstName, String lastName);
    List<User>findByRoleAndFirstNameContainingIgnoreCase(Role role, String firstName);
    List<User>findByRoleAndLastNameContainingIgnoreCase(Role role, String lastName);
}
