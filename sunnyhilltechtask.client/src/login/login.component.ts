import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '.././services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  animationOptions: AnimationOptions = {
    path: '/assets/animation.json', // Path to your Lottie animation JSON file
  };
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.snackBar.open('Login Successful!', 'Close', { duration: 3000, panelClass: 'success-snackbar' });
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(err.error.message || 'Login Failed!', 'Close', { duration: 3000, panelClass: 'error-snackbar' });
      }
    });
  }
}
