package com.opth.clinic.ophthalmology_backend.service;

import com.opth.clinic.ophthalmology_backend.exception.NotFoundException;
import com.opth.clinic.ophthalmology_backend.model.Doctor;
import com.opth.clinic.ophthalmology_backend.respository.DoctorRespository;
import org.springframework.security.core.Authentication;
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

    public Doctor addDoctor(Doctor doctor, Authentication auth) {
        String role = auth.getAuthorities().iterator().next().getAuthority();

        if (!role.equals("ROLE_ADMIN")) {
            throw new RuntimeException("Nie masz pozwolenia!");
        }
        return doctorRespository.save(doctor);
    }

    public Doctor updateDoctor(Long id, Doctor doctor, Authentication auth) {
        String role = auth.getAuthorities().iterator().next().getAuthority();

        if (!role.equals("ROLE_ADMIN")) {
            throw new RuntimeException("Nie masz pozwolenia!");
        }

        Doctor existingDoctor = doctorRespository.findById(id).orElseThrow(() -> new NotFoundException("Nie znaleziono lekarza"));
        if(doctor.getFirstName() != null) existingDoctor.setFirstName(doctor.getFirstName());
        if(doctor.getLastName() != null) existingDoctor.setLastName(doctor.getLastName());
        if(doctor.getActive() != null) existingDoctor.setActive(doctor.getActive());
        return doctorRespository.save(existingDoctor);
    }

    public void deleteDoctorById(Long id, Authentication auth) {
        String role = auth.getAuthorities().iterator().next().getAuthority();

        if (!role.equals("ROLE_ADMIN")) {
            throw new RuntimeException("Nie masz pozwolenia!");
        }
        doctorRespository.deleteById(id);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRespository.findAll();
    }
}
