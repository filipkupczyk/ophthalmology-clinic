import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../models/app.model';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-appointments',
  imports: [CommonModule, RouterLink, RouterModule],
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
        this.appointments = data
        console.log(data);
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  onDelete(id: number): void {
    this.appointmentService.deleteApp(id).subscribe();
    this.appointments = this.appointments.filter(app => app.id !== id);
    this.cdr.detectChanges();
  }
}
