import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterRequest } from '../../models/auth.model';
import { User } from '../../models/user.models';
import { Auth } from '../../services/auth';
import { isActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  currentUser$: Observable<User | null>;

  credentials: RegisterRequest = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: ''
  };
  errorMassage = '';

  constructor(
    private authService: Auth,
    private router: Router,
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

    get isAdmin(): boolean {
      return this.authService.isAdmin();
    }

  onSubmit(): void {
    this.credentials.role = this.isAdmin ? this.credentials.role : 'PATIENT';
    this.authService.register(this.credentials).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.errorMassage = 'Nie mozna stworzyc uzytkownika'
    });
  }
}
