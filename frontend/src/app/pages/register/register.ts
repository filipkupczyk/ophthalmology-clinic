import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterRequest } from '../../models/auth.model';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  credentials: RegisterRequest = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: ''
  };
  errorMassage = '';
  isVisible = false;

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      this.isVisible = true;
    }
  }

  onSubmit(): void {
    if (!this.authService.isAdmin()) {
      this.credentials.role = 'PATIENT';
    }
    this.authService.register(this.credentials).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.errorMassage = "Nie można stworzyć urzytkownika";
        console.error("Register error", error);
      }
    }
    )
  }

}
