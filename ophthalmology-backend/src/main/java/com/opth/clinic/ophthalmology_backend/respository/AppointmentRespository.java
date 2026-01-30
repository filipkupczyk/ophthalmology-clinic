package com.opth.clinic.ophthalmology_backend.respository;

import com.opth.clinic.ophthalmology_backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface AppointmentRespository extends JpaRepository<Appointment,Long> {
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByUserId(Long userId);
    Optional<Appointment>findByDoctorIdAndDateTime(Long doctorId, LocalDateTime date);
}
