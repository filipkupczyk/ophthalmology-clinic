import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.models';
import { Auth } from '../../services/auth';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  currentUser: User | null = null;
  isLogged = false;

  constructor(private authService: Auth) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe( user => {
      this.currentUser = user;
      this.isLogged = !!user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.isLogged = false;
  }
}
