import { Component } from '@angular/core';
import { CreateAppointmentRequest, Appointment } from '../../models/app.model';
import { AppointmentService } from '../../services/appointment.service';
import { DoctorService } from '../../services/doctor.service';
import { Auth } from '../../services/auth';
import { Doctor } from '../../models/user.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '../../models/user.models';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-create-appointments',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-appointments.html',
  styleUrl: './create-appointments.css',
})
export class CreateAppointments {
  currentUser$: Observable<User | null>;
  selectedDoctorId: number = 0;
  selectedPatientId: number = 0;
  selectedDateTime: string = '';

  Doctors: Doctor[] = [];
  errorMessage = '';

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private authService: Auth,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUser$ = authService.currentUser$;
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.doctorService.getAllDoctors().subscribe({
      next: (data) => {
        this.Doctors = data;
        if (data.length > 0){
          this.selectedDoctorId = data[0].id;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = "Nie można pobrać lekarzy";
      }
    });
  }
  ngOnSubmit(): void {
    const currentUser = this.authService.getCurrentUser();
    const patientId = this.isAdmin ? this.selectedPatientId : currentUser!.id;
    const credentials: Partial<Appointment> = {
      doctor: {id: this.selectedDoctorId} as Doctor,
      user: {id: patientId} as any,
      dateTime: this.selectedDateTime,
      active: true
    };
    console.log('Credentials before send:', credentials);
    if (this.selectedDoctorId === 0) {
    this.errorMessage = "Wybierz doktora";
    return;
    }
  
    if (!credentials.dateTime) {
      this.errorMessage = "Wybierz datę i godzinę";
      return;
    }
    this.appointmentService.createNewApp(credentials).subscribe({
      next: (data) => {
        console.log('Created:', data);
      },
      error: (err) => {
        console.error('Error:', err);
        if (err.status === 401) {
          this.errorMessage = "Musisz być zalogowany";
        } else if (err.status === 403) {
          this.errorMessage = "Brak uprawnień";
        } else {
          this.errorMessage = "Nie udało się utworzyć wizyty";
        }
      }
    })
  }
}

