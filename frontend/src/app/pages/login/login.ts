import { Component } from '@angular/core';
import { LoginRequest } from '../../models/auth.model';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };
  errorMessage = '';
  isLoading = false;
  isError = false;

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  onSubmit(): void {
    this.isLoading = true;
    this.isError = false;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        localStorage.setItem("token", response.token);
        this.authService.loadCurrentUser();
        console.log(response);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = "Nieprawidłowy email lub hasło";
        this.isError = true;
        console.error('Login error: ', error);
      }
    });
  }
}
