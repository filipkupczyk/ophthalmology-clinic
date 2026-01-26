import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../models/app.model';

@Component({
  selector: 'app-appointments',
  imports: [CommonModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})

export class Appointments implements OnInit {

  appointments: Appointment[] = [];

  constructor(private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.appointmentService.allApp().subscribe({
      next: (data) => {
        console.log('CAŁY OBIEKT:', data[0]);
        console.log('CZY MA dateTime?', 'dateTime' in data[0]);
        console.log('WARTOŚĆ dateTime:', data[0].dateTime);
        console.log('TYP dateTime:', typeof data[0].dateTime);
        this.appointments = data
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
}
