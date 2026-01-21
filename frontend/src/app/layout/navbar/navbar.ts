import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.models';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [],
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
  }
}
