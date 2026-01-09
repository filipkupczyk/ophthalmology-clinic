package com.opth.clinic.ophthalmology_backend.service;

import com.opth.clinic.ophthalmology_backend.exception.NotFoundException;
import com.opth.clinic.ophthalmology_backend.model.Appointment;
import com.opth.clinic.ophthalmology_backend.model.Doctor;
import com.opth.clinic.ophthalmology_backend.model.User;
import com.opth.clinic.ophthalmology_backend.respository.AppointmentRespository;
import com.opth.clinic.ophthalmology_backend.respository.DoctorRespository;
import com.opth.clinic.ophthalmology_backend.respository.UserRespository;
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

    public Appointment getAppointmentById(Long id){
        return appointmentRespository.findById(id).get();
    }

    public Appointment addAppointment(Appointment appointment){
        Doctor doctor = doctorRespository.findById(appointment.getDoctor().getId()).orElseThrow(() -> new NotFoundException("Nie znaleziono lekarza"));
        User patient = userRespository.findById(appointment.getUser().getId()).orElseThrow(() -> new NotFoundException("Nie znaleziono pacjenta"));
        Appointment newAppointment = new Appointment();
        newAppointment.setDoctor(doctor);
        newAppointment.setUser(patient);
        newAppointment.setActive(true);
        newAppointment.setDateTime(appointment.getDateTime());
        return appointmentRespository.save(newAppointment);
    }

    public Appointment updateAppointment(Long id, Appointment appointment) {
        Appointment existingAppointment = appointmentRespository.findById(id).orElseThrow(() -> new NotFoundException("Nie znaleziono lekarza"));
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

    public void deleteAppointment(Long id) {
        appointmentRespository.deleteById(id);
    }

    public List<Appointment> getAllAppointments(){
        return appointmentRespository.findAll();
    }
}
