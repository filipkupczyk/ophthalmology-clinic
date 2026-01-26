package com.opth.clinic.ophthalmology_backend.service;

import com.opth.clinic.ophthalmology_backend.exception.NotFoundException;
import com.opth.clinic.ophthalmology_backend.model.Appointment;
import com.opth.clinic.ophthalmology_backend.model.Doctor;
import com.opth.clinic.ophthalmology_backend.model.User;
import com.opth.clinic.ophthalmology_backend.respository.AppointmentRespository;
import com.opth.clinic.ophthalmology_backend.respository.DoctorRespository;
import com.opth.clinic.ophthalmology_backend.respository.UserRespository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {
    private final AppointmentRespository appointmentRespository;
    private final DoctorRespository doctorRespository;
    private final UserRespository userRespository;

    public AppointmentService(AppointmentRespository appointmentRespository,  DoctorRespository doctorRespository, UserRespository userRespository) {
        this.appointmentRespository = appointmentRespository;
        this.doctorRespository = doctorRespository;
        this.userRespository = userRespository;
    }

    public Appointment getAppointmentById(Long id, Authentication auth) {
        String email = auth.getName();
        String role =  auth.getAuthorities().iterator().next().getAuthority();

        User user = userRespository.findByEmail(email).orElseThrow(()-> new NotFoundException("User not found"));
        Appointment appointment = appointmentRespository.findById(id).orElseThrow(()-> new NotFoundException("Appointment not found"));

        if (role.equals("ROLE_PATIENT")){
            if (!appointment.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Nie można zwrocic tej wizyty!");
            }
        }
        if (role.equals("ROLE_DOCTOR")) {
            if (!appointment.getDoctor().getId().equals(user.getDoctor().getId())) {
                throw new RuntimeException("Nie można zwrocic tej wizyty!");
            }
        }
        return appointment;
    }

    public Appointment addAppointment(Appointment appointment, Authentication auth) {

        String email = auth.getName();
        String role = auth.getAuthorities().iterator().next().getAuthority();

        User user = userRespository.findByEmail(email).orElseThrow(()->new NotFoundException("User not found"));
        Doctor doctor = doctorRespository.findById(appointment.getDoctor().getId()).orElseThrow(()->new NotFoundException("Doctor not found"));

        Appointment newAppointment = new Appointment();
        newAppointment.setDoctor(doctor);
        newAppointment.setActive(true);
        newAppointment.setDateTime(appointment.getDateTime());
        if (role.equals("ROLE_ADMIN") || role.equals("ROLE_SECRETARY")) {
            System.out.println("Entering ADMIN/SECRETARY block");
            User newUser = userRespository.findById(appointment.getUser().getId()).orElseThrow(()->new NotFoundException("User not found"));
            newAppointment.setUser(newUser);
            System.out.println("Set user to: " + newUser.getId());
        }
        else if (role.equals("ROLE_PATIENT")) {
            newAppointment.setUser(user);
        }
        return appointmentRespository.save(newAppointment);
    }

    public Appointment updateAppointment(Long id, Appointment appointment, Authentication auth) {
        String email = auth.getName();
        String role = auth.getAuthorities().iterator().next().getAuthority();

        User user =  userRespository.findByEmail(email).orElseThrow(()->new NotFoundException("User not found"));
        Appointment existingAppointment = appointmentRespository.findById(id).orElseThrow(() -> new NotFoundException("Nie znaleziono lekarza"));

        if (role.equals("ROLE_PATIENT")) {
            if (!existingAppointment.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Nie mozna edytowac nie swoich wizyt!");
            }
        }
        if (role.equals("ROLE_DOCTOR")){
            if (!existingAppointment.getUser().getDoctor().equals(user.getDoctor())) {
                throw new RuntimeException("Możesz edytować tylko swoje wizyty!");
            }
        }
        if (appointment.getDoctor() != null && appointment.getDoctor().getId() != null) {
            Doctor doctor = doctorRespository.findById(appointment.getDoctor().getId()).orElseThrow(() -> new NotFoundException("Nie znaleziono lekarza"));
            if (appointment.getDoctor() != null)  existingAppointment.setDoctor(doctor);
        }
        if (appointment.getUser() != null && appointment.getUser().getId() != null) {
            User patient = userRespository.findById(appointment.getUser().getId()).orElseThrow(() -> new NotFoundException("Nie znaleziono pacjenta"));
            if (appointment.getUser() != null) existingAppointment.setUser(patient);
        }
        if (appointment.getDateTime() != null) existingAppointment.setDateTime(appointment.getDateTime());
        if (appointment.getActive() != null) existingAppointment.setActive(appointment.getActive());
        return appointmentRespository.save(existingAppointment);
    }

    public void deleteAppointment(Long id, Authentication auth) {
        String email = auth.getName();
        String role =  auth.getAuthorities().iterator().next().getAuthority();

        User user = userRespository.findByEmail(email).orElseThrow(()-> new NotFoundException("User not found"));
        Appointment appointment = appointmentRespository.findById(id).orElseThrow(()-> new NotFoundException("Appointment not found"));

        if (role.equals("ROLE_PATIENT")){
            if (!appointment.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Nie można usunąć tej wizyty!");
            }
        }
        if (role.equals("ROLE_DOCTOR")) {
            if (!appointment.getDoctor().getId().equals(user.getDoctor().getId())) {
                throw new RuntimeException("Nie można usunąć tej wizyty!");
            }
        }
        appointmentRespository.deleteById(id);
    }

    public List<Appointment> getAllAppointments(Authentication auth){
        String email = auth.getName();
        String role = auth.getAuthorities().iterator().next().toString();

        User user = userRespository.findByEmail(email).orElseThrow(() -> new NotFoundException("Nie znaleziono usera"));

        if (role.equals("ROLE_ADMIN") || role.equals("ROLE_SECRETARY")) {
            return appointmentRespository.findAll();
        }
        else if (role.equals("ROLE_DOCTOR")) {
            Long doctor_id = user.getDoctor().getId();
            return appointmentRespository.findByDoctorId(doctor_id);
        }
        else {
            return appointmentRespository.findByUserId(user.getId());
        }
    }
}
