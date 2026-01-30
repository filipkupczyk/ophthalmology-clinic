package com.opth.clinic.ophthalmology_backend.controller;

import com.opth.clinic.ophthalmology_backend.model.Appointment;
import com.opth.clinic.ophthalmology_backend.model.Doctor;
import com.opth.clinic.ophthalmology_backend.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments(Authentication auth) {
        return ResponseEntity.ok(appointmentService.getAllAppointments(auth));
    }

    @GetMapping("/{id}")
    public Appointment getAppointmentById(@PathVariable Long id, Authentication auth) {
        return appointmentService.getAppointmentById(id, auth);
    }

    @PostMapping("/create")
    public Appointment createAppointment(@RequestBody Appointment appointment, Authentication auth) {
        return appointmentService.addAppointment(appointment, auth);
    }

    @PutMapping("/update/{id}")
    public Appointment updateAppointment(@PathVariable Long id, @RequestBody Appointment appointment, Authentication auth) {
        return appointmentService.updateAppointment(id, appointment, auth);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteAppointmentById(@PathVariable Long id, Authentication auth) {
        appointmentService.deleteAppointment(id, auth);
    }
}
