package com.opth.clinic.ophthalmology_backend.service;

import com.opth.clinic.ophthalmology_backend.exception.NotFoundException;
import com.opth.clinic.ophthalmology_backend.model.Doctor;
import com.opth.clinic.ophthalmology_backend.respository.DoctorRespository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DoctorService {
    private final DoctorRespository doctorRespository;

    public DoctorService(DoctorRespository doctorRespository) {
        this.doctorRespository = doctorRespository;
    }

    public Doctor getDoctorById(Long id) {
        return doctorRespository.findById(id).get();
    }

    public Doctor addDoctor(Doctor doctor) {
        return doctorRespository.save(doctor);
    }

    public Doctor updateDoctor(Long id, Doctor doctor) {
        Doctor existingDoctor = doctorRespository.findById(id).orElseThrow(() -> new NotFoundException("Nie znaleziono lekarza"));
        if(doctor.getFirstName() != null) existingDoctor.setFirstName(doctor.getFirstName());
        if(doctor.getLastName() != null) existingDoctor.setLastName(doctor.getLastName());
        if(doctor.getActive() != null) existingDoctor.setActive(doctor.getActive());
        return doctorRespository.save(existingDoctor);
    }

    public void deleteDoctorById(Long id) {
        doctorRespository.deleteById(id);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRespository.findAll();
    }
}
