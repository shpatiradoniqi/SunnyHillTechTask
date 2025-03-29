import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
interface User {
  email: string;
  role: string;
  token: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  private apiUrl = 'https://localhost:7153/api/auth';  
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')!));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  
  // Get current logged-in user
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
 
  isLoggedIn(): boolean {
    const token = localStorage.getItem('currentUser');  
    return !!token;  
  }

  // Login method
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          // Store user data and token in localStorage
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.currentUserSubject.next(response);
        }),
        catchError(this.handleError)
      );
  }

  // Registration method


  register(name: string, email: string, password: string): Observable<any> {
    const role = 'StandardUser'; // Default role (handled in backend too)

    return this.http.post<any>(`${this.apiUrl}/register`,
      { name, email, password, role },
      { headers: { 'Content-Type': 'application/json' } }
      )
      .pipe(
        tap(() => {
          console.log('User registered successfully');
        }),
        catchError(this.handleError)
      );
  }
   
 
  // Logout method
  logout(): void {
    // Remove user from localStorage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null!);
    this.router.navigate(['/login']);
  }

  // Utility method to check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.currentUserValue; // If currentUserValue is null, not authenticated
  }

  // Handle errors from HTTP requests
  private handleError(error: any) {
    console.error('AuthService Error:', error);
    return throwError(() => new Error(error.message || 'Something went wrong'));
  }

  // Utility method to get the JWT token
  getToken(): string {
    return this.currentUserValue?.token;
  }

 
  
  // Utility method to check if the user is an Admin
  isAdmin(): boolean {
   return this.currentUserValue?.role === 'Admin';
  }
}
