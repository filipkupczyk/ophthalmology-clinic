import { Component } from '@angular/core';
import { Appointment } from '../../models/app.model';
import { AppointmentService } from '../../services/appointment.service';
import { DoctorService } from '../../services/doctor.service';
import { Auth } from '../../services/auth';
import { Doctor } from '../../models/user.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { distinctUntilChanged, Observable, Subject, debounceTime, switchMap } from 'rxjs';
import { User } from '../../models/user.models';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

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
  patientFirstName: string = '';
  patientLastName:string  = '';
  isDone: boolean = false;
  show: boolean = false;

  Doctors: Doctor[] = [];
  Patients: User[] = [];
  errorMessage = '';
  private searchSubject = new Subject<{firstName: string, lastName: string}>();

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private authService: Auth,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.currentUser$ = authService.currentUser$;
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    if (this.isLoggedIn){
      this.show = true;
      this.cdr.detectChanges();
    }
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged((prev, curr) => {
      const same = prev.firstName === curr.firstName && prev.lastName === curr.lastName;
      console.log('distinctUntilChanged - prev:', prev, 'curr:', curr, 'same:', same);
      return same;}),
    switchMap(({firstName, lastName}) => {
      console.log('switchMap called with:', {firstName, lastName});
      return this.authService.searchUsers(firstName, lastName);
    })).subscribe(data => {
      console.log('Response received: ', data);
      this.Patients = data;
      this.cdr.detectChanges();
      if (data.length > 0) {
        this.selectedPatientId = data[0].id;
      }
      console.log(data);
    });
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
        this.isDone = true;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/appointments']);
        }, 2000);
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

  onPatientSearch(): void {
    const firstValid = this.patientFirstName?.length >= 2;
    const lastValid = this.patientLastName?.length >= 2;
    console.log('firstValid:', firstValid, 'lastValid:', lastValid);
    console.log('firstName:', this.patientFirstName, 'lastName:', this.patientLastName);


    if (!firstValid && !lastValid) {
      this.Patients = [];
      console.log("Cleared - both invalid");
      return; 
    }

    const firstNameParam = firstValid ? this.patientFirstName : '';
    const lastNameParam = lastValid ? this.patientLastName: ''; 

    console.log('Sending to subject:', {firstName: firstNameParam, lastName: lastNameParam});
    this.searchSubject.next( {firstName: firstNameParam, lastName: lastNameParam});
  }
}

