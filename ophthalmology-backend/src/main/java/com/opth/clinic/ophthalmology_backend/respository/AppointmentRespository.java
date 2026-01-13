package com.opth.clinic.ophthalmology_backend.respository;

import com.opth.clinic.ophthalmology_backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRespository extends JpaRepository<Appointment,Long> {
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByUserId(Long userId);
}
