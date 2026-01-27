import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '.././models/user.models';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = "http://localhost:8080";
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}
  
  initAuth() {
    const token = this.getToken();
    if (!token) return;
    this.loadCurrentUser();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
    .pipe(
      tap(response => {
        this.setToken(response.token);
        this.loadCurrentUser();
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users/create`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');

    if (!token || token === 'null' || token === 'undefined') {
      return null;
    }
    return token;
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  loadCurrentUser(): void {
    this.http.get<User>(`${this.apiUrl}/users/me`).subscribe({
      next: (user) => {
        this.currentUserSubject.next(user);
      },
      error: (error) => {
        console.error('Błąd ładownaia użytkownika:', error);
      }
    })
  }

  searchUsers(firstName: string, lastName: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/search?firstName=${firstName}&lastName=${lastName}`);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role == role;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }
}
