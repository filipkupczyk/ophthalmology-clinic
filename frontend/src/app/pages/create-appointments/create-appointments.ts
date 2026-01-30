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
import { RegisterRequest } from '../../models/auth.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { App } from '../../app';


@Component({
  selector: 'app-create-appointments',
  imports: [CommonModule,
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule, 
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pl-PL'}
  ],
  templateUrl: './create-appointments.html',
  styleUrl: './create-appointments.css',
})
export class CreateAppointments {
  currentUser$: Observable<User | null>;
  selectedDoctorId: number = 0;
  selectedPatientId: number = 0;
  selectedDate: Date | null = null;
  selectedHour: string = '';
  patientFirstName: string = '';
  patientLastName:string  = '';
  patientEmail: string = '';
  patientPassword: string = '';
  isDone: boolean = false;
  show: boolean = false;
  isFirstVisit: boolean = false;
  availableTimeSlots: string[] = [];
  occupiedTimeSlots: Set<string> = new Set();
  occupiedDates: Set<string> = new Set();
  currentDateFilter: ((date: Date | null) => boolean) | null = null;

  Doctors: Doctor[] = [];
  Patients: User[] = [];
  errorMessage = '';
  private searchSubject = new Subject<{firstName: string, lastName: string}>();

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private authService: Auth,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.currentUser$ = authService.currentUser$;
    this.dateAdapter.setLocale('pl-PL');
    this.dateAdapter.getFirstDayOfWeek = () => 1;
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  dateFilterMonika = (date: Date | null): boolean => {
    if (!date) return false;
    const day = date.getDay();

    return day === 2 || day ===3;
  }
  dateFilterDanuta = (date: Date | null): boolean => {
     if (!date) return false;
    const day = date.getDay();

    return day === 4 || day === 5;
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  onDoctorsChange(): void {
    this.selectedDate = null;
    this.appointmentService.allApp().subscribe({
      next: (data) => {
        this.occupiedTimeSlots = new Set(
          data.map(app => app.dateTime)
        );
        this.updateOccupiedDates();
        this.cdr.detectChanges();
      }
    })

    switch(this.selectedDoctorId) {
      case 1:
        this.currentDateFilter = this.combinedDateFilter(this.dateFilterMonika);
        break;
      case 2:
        this.currentDateFilter = this.combinedDateFilter(this.dateFilterDanuta);
        break;
      default:
        this.currentDateFilter = (date: Date | null) => false;
    }

    this.cdr.detectChanges();
  }

  updateOccupiedDates(): void {
    const occupiedDatesSet = new Set<string>();

    const dates = new Set(
      Array.from(this.occupiedTimeSlots).map(slot => slot.split('T')[0])
    );

    dates.forEach(date => {
      const occupiedSlotsForDate = this.availableTimeSlots.filter(slot => {
        const fullDateTime = `${date}T${slot}:00`;
        return this.occupiedTimeSlots.has(fullDateTime);
      }).length;

      if (occupiedSlotsForDate === this.availableTimeSlots.length) {
        occupiedDatesSet.add(date);
      }
    });

    this.occupiedDates = occupiedDatesSet;
  }

  combinedDateFilter(dateFilter: (date: Date | null) => boolean): (date: Date | null) => boolean {
    return (date: Date | null): boolean => {
      if (!date) return false;

      if(!dateFilter(date)) return false;

      const occupiedDate = this.formatDate(date);
      return !this.occupiedDates.has(occupiedDate);
    }
  }

  get availableTimeSlotsFiltered(): string[] {
    if (!this.selectedDate) return this.availableTimeSlots;
    const datePart = this.formatDate(this.selectedDate);
    return this.availableTimeSlots.filter(slot => {
      const date = `${datePart}T${slot}:00`;
      return !this.occupiedTimeSlots.has(date);
    })
  }

  onDatesChange(): void {
    this.selectedHour = '';
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.currentDateFilter = (date: Date | null) => false;
    this.availableTimeSlots = Array.from({length: 12}, (_, i) => {
    const totalMinutes = 13 * 60 + i * 20;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return h < 17 ? `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}` : null;
    }).filter(Boolean) as string[];
    if (this.isLoggedIn){
      this.show = true;
      this.cdr.detectChanges();
    }
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged((prev, curr) => {
      const same = prev.firstName === curr.firstName && prev.lastName === curr.lastName;
      return same;}),
    switchMap(({firstName, lastName}) => {
      return this.authService.searchUsers(firstName, lastName);
    })).subscribe(data => {
      this.Patients = data;
      this.cdr.detectChanges();
      if (data.length > 0) {
        this.selectedPatientId = data[0].id;
      }
    });
    this.doctorService.getAllDoctors().subscribe({
      next: (data) => {
        this.Doctors = data;
        if (data.length > 0){
          this.selectedDoctorId = data[0].id;
          this.onDoctorsChange();
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = "Nie można pobrać lekarzy";
      }
    });
  }
  createApp(id: number): void {
    if (!this.selectedDate) return;
    const datePart = this.formatDate(this.selectedDate);
    let date = `${datePart}T${this.selectedHour}:00`;
    console.log(date);
    const credentials: Partial<Appointment> = {
      doctor: {id: this.selectedDoctorId} as Doctor,
      user: {id: id} as any,
      dateTime: date,
      active: true
    };
    console.log(credentials);
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

  ngOnSubmit(): void {
    const currentUser = this.authService.getCurrentUser();
     if (this.selectedDoctorId === 0) {
      this.errorMessage = "Wybierz doktora";
    return;
    }
  
    if (!this.selectedDate) {
      this.errorMessage = "Wybierz datę";
      return;
    }
    if (!this.selectedHour) {
      this.errorMessage = "Wybierz godzine";
      return;
    }
    if (this.isFirstVisit) {
          if (!this.patientEmail || !this.patientPassword) {
            this.errorMessage = "Wypełnij email i hasło dla nowego pacjenta";
            return;
          }
          let newPatient: RegisterRequest = {
            firstName: this.patientFirstName,
            lastName: this.patientLastName,
            email: this.patientEmail,
            password: this.patientPassword,
            role: 'PATIENT'
          }
          this.authService.registerAdmin(newPatient).subscribe({
            next: (response) => {
              this.createApp(response.id);
              console.log("Pacjent zarejestrowany: ", response);
            },
            error: (err) => {
              console.log(err);
            }
          })
    } else {
      const patientId = this.isAdmin ? this.selectedPatientId : currentUser!.id;
      this.createApp(patientId);
    }
  }

  onPatientSearch(): void {
    if (this.isFirstVisit) {
      return;
    }

    const firstValid = this.patientFirstName?.length >= 2;
    const lastValid = this.patientLastName?.length >= 2;


    if (!firstValid && !lastValid) {
      this.Patients = [];
      return; 
    }

    const firstNameParam = firstValid ? this.patientFirstName : '';
    const lastNameParam = lastValid ? this.patientLastName: ''; 
    this.searchSubject.next( {firstName: firstNameParam, lastName: lastNameParam});
  }
}

