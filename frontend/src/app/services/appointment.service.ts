import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UpdaAppointmentRequest } from '../models/app.model';
import { Auth } from './auth';
import { Observable } from 'rxjs';
import { Appointment } from '../models/app.model';
@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = "http://localhost:8080/appointments";
  constructor(private http: HttpClient, private authService: Auth) {}

  isUser(): void {
    const user = this.authService.getCurrentUser();
    if (!user) throw new Error("Nie zalogowano uzytkownika");
  }
  
  allApp(): Observable<Appointment[]> {
    this.isUser()
    return this.http.get<Appointment[]>(`${this.apiUrl}`)
  }

  getOneApp(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`)
  }

  createNewApp(credentials: Partial<Appointment>): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/create`, credentials)
  }

  updateApp(credentials: Partial<Appointment>, id:number): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/update/${id}`, credentials)
  }

  deleteApp(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`)
  }
}
