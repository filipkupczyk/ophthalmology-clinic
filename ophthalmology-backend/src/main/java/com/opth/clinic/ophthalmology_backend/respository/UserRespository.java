package com.opth.clinic.ophthalmology_backend.respository;
import com.opth.clinic.ophthalmology_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRespository extends JpaRepository<User, Long> {}
