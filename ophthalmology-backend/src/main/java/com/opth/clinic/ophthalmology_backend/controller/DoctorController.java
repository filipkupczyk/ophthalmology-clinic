package com.opth.clinic.ophthalmology_backend.controller;

import com.opth.clinic.ophthalmology_backend.model.Doctor;
import com.opth.clinic.ophthalmology_backend.service.DoctorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors")
public class DoctorController {
    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public List<Doctor> findAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @GetMapping("/{id}")
    public Doctor findDoctorById(Long id) {
        return doctorService.getDoctorById(id);
    }

    @PutMapping("/update/{id}")
    public Doctor updateDoctorById(@PathVariable Long id, @RequestBody Doctor doctor) {
        return doctorService.updateDoctor(id, doctor);
    }

    @PostMapping("/create")
    public Doctor createDoctor(@RequestBody Doctor doctor) {
        return doctorService.addDoctor(doctor);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteDoctorById(@PathVariable Long id) {
        doctorService.deleteDoctorById(id);
    }
}
