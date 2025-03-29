//import { HttpClientModule } from '@angular/common/http';
//import { NgModule } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';

//import { AppRoutingModule } from './app-routing.module';
//import { AppComponent } from './app.component';

//@NgModule({
//  declarations: [
//    AppComponent
//  ],
//  imports: [
//    BrowserModule, HttpClientModule,
//    AppRoutingModule
//  ],
//  providers: [],
//  bootstrap: [AppComponent]
//})
//export class AppModule { }
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


// Routing
import { AppRoutingModule } from './app-routing.module';

// Root Component
import { AppComponent } from './app.component';
import { LoginComponent } from '../../src/login/login.component';
import { RegisterComponent } from '../../src/register/register.component';
//import { ProductManagementComponent } from '../../src/product-management/product-management.component';
import { ProductManagementComponent } from '../../src/productmanagement/product-management/product-management.component';
import { ProfileComponent } from '../../src/profile/profile.component';

// Services
import { AuthService } from './../services/auth.service';// Handles Login & Register
import { UserService } from './../services/user.service';// Handles Profile Updates
import { ProductService } from './../services/product.service';



import { AdminGuard } from './../guards/admin.guard';

// Angular Material Modules (Only Essential Ones)
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import player from 'lottie-web';
import { HomeComponent } from '../home/home.component';



@NgModule({
  declarations: [
    AppComponent, // Keep only root component, assuming others are inside feature modules
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProductManagementComponent,
    ProfileComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
   
    
    // Angular Material (Optimized for UI needs)
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule, 
  ],
  providers: [
    AuthService,
    ProductService,
    UserService,
    AdminGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


