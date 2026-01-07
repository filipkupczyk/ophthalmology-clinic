package com.opth.clinic.ophthalmology_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Doctor doctor;

    @ManyToOne
    private User user;

    private LocalDateTime dateTime;

    private boolean active;

    public Long getId() {
        return id;
    }
    private void setId(Long id) {
        this.id = id;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getDateTime(){
        return dateTime;
    }
    public void setDateTime(LocalDateTime dateTime){
        this.dateTime = dateTime;
    }

    public boolean getActive(){
        return active;
    }
    public void setActive(boolean active){
        this.active = active;
    }

}
