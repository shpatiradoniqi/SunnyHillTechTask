import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    // Retrieve user role from localStorage
    const userRole = localStorage.getItem('userRole');

    // Check if the role is 'Admin'
    if (userRole === 'Admin') {
      return true;  // User is admin, allow access to the route
    } else {
      this.router.navigate(['/']);  // Redirect to home if not an admin
      return false;  // Deny access to the route
    }
  }
}
