import { Component, ChangeDetectorRef } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from '../../models/app.model';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../services/doctor.service';
import { Doctor, User } from '../../models/user.models';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-appointments',
  imports: [ CommonModule, FormsModule],
  templateUrl: './edit-appointments.html',
  styleUrl: './edit-appointments.css',
  standalone: true
})
export class EditAppointments {
  appointment!: Appointment;
  appointmentId: number = 0;
  selectedDoctorId: number = 0;
  selectedDateTime:string = '';
  Doctors: Doctor[] = [];
  errorMessage = '';
  isDone: boolean = false;
  constructor(
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private doctorService: DoctorService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.appointmentId = Number(params.get('id'));
      forkJoin({
        appointment: this.appointmentService.getOneApp(this.appointmentId),
        doctors: this.doctorService.getAllDoctors()
      }).subscribe({
        next : ({appointment, doctors}) => {
          this.appointment = appointment;
          this.Doctors = doctors;
          this.selectedDateTime = appointment.dateTime.slice(0, 16);
          this.selectedDoctorId = appointment.doctor.id;
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err)
      });
    });
  }

  ngOnSubmit(): void {
    const credentials: Partial<Appointment> = {
      doctor: {id: this.selectedDoctorId} as Doctor,
      user: {id: this.appointment.user.id} as User,
      dateTime: this.selectedDateTime,
      active: true
    }

    this.appointmentService.updateApp(credentials, this.appointment.id).subscribe({
      next: () => {
        this.isDone = true;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/appointments']);
        }, 2000)
        console.log("wizyta zakutalizowana");
      },
      error: (err) => {
        console.error('Error:', err);
         if (err.status === 401) {
          this.errorMessage = "Musisz być zalogowany";
        } else if (err.status === 403) {
          this.errorMessage = "Brak uprawnień";
        } else {
          this.errorMessage = "Nie udało się edytować wizyty";
        }
      }
    })
  }
}
