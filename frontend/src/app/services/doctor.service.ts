import { Injectable } from '@angular/core';
import { Doctor } from '../models/user.models';
import { Auth } from '../services/auth';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private apiUrl = 'http://localhost:8080/doctors';

   constructor(private http: HttpClient, private authService: Auth) {}

  getDoctor(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`)
  }

  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}`)
  }

}
