package com.opth.clinic.ophthalmology_backend.respository;
import com.opth.clinic.ophthalmology_backend.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRespository extends JpaRepository<Doctor, Long> {}
