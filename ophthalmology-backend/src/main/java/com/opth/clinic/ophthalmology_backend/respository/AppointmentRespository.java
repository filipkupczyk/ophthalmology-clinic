package com.opth.clinic.ophthalmology_backend.respository;

import com.opth.clinic.ophthalmology_backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRespository extends JpaRepository<Appointment,Long> {}
