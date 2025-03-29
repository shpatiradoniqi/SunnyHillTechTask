import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  welcomeMessage: string = '';
  userName: string = '';
  userRole: string = ''; 
  totalProducts: number = 0;
  totalUsers: number = 0;
  totalSales: number = 324; 
  chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
      label: 'Sales',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: true,
      borderColor: 'rgba(75, 192, 192, 1)',
      tension: 0.4
    }]
  };

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.setWelcomeMessage();
    this.fetchDashboardData();
    const token = localStorage.getItem('currentUser');
    console.log("Stored Token:", token);
  }
  
  logout() {
    localStorage.removeItem('currentUser'); 
    this.router.navigate(['/login']); 
  }



  // Fetches dashboard data directly within the component
  fetchDashboardData(): void {
    const currentUser = localStorage.getItem('currentUser');
    const token = currentUser ? JSON.parse(currentUser).token : null; // Extract token

    if (!token) {
      console.error("No token found! Redirecting to login.");
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<number>('https://localhost:7153/api/dashboard/products/count', { headers })
      .subscribe(
        data => this.totalProducts = data,
        error => console.error("Error fetching products count:", error)
      );

    this.http.get<number>('https://localhost:7153/api/dashboard/users/count', { headers })
      .subscribe(
        data => this.totalUsers = data,
        error => console.error("Error fetching users count:", error)
      );

    //this.http.get<any>('https://localhost:7153/api/dashboard/user/info', { headers })
    //  .subscribe(
    //    data => {
    //      console.log("User Info:", data);
    //      this.userName = data.name || 'Guest';
    //      this.userRole = data.role || 'Standard';
    //      this.setWelcomeMessage();
    //    },
    //    error => console.error("Error fetching user info:", error)
    //  );
    this.http.get<any>('https://localhost:7153/api/dashboard/user/info', { headers })
      .subscribe(
        data => {
          console.log("User Info:", data);
          this.userName = data.name || 'Guest'; // Fallback to 'Guest' if name is not available
          this.userRole = data.role || 'Standard'; // Fallback to 'Standard' if role is not available
          localStorage.setItem('userRole', this.userRole);
          localStorage.setItem('userName', this.userName);
        },
        error => {
          console.error("Error fetching user info:", error);
          this.userName = "Guest" // Set default value if there's an error
          this.userRole = 'Standard'; // Set default value if there's an error
        }
      );
  }


  
  setWelcomeMessage(): void {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      this.welcomeMessage = `Good Morning ${this.userRole === 'Admin' ? 'Admin' : ''} ${this.userName || ''}`;
    } else if (currentHour < 18) {
      this.welcomeMessage = `Good Afternoon ${this.userRole === 'Admin' ? 'Admin' : ''} ${this.userName || ''}`;
    } else {
      this.welcomeMessage = `Good Evening ${this.userRole === 'Admin' ? 'Admin' : ''} ${this.userName || ''}`;
    }
  }
}
