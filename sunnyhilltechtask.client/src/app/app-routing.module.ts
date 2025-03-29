//import { NgModule } from '@angular/core';
//import { RouterModule, Routes } from '@angular/router';

//const routes: Routes = [];

//@NgModule({
//  imports: [RouterModule.forRoot(routes)],
//  exports: [RouterModule]
//})
//export class AppRoutingModule { }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '.././login/login.component';
import { RegisterComponent } from '.././register/register.component';
import { HomeComponent } from '.././home/home.component';
import { ProductManagementComponent } from '../../src/productmanagement/product-management/product-management.component'; // <-- Relative path
import { ProfileComponent } from '../../src/profile/profile.component';

import { AdminGuard } from './../guards/admin.guard';

const routes: Routes = [
  { path: '', component: LoginComponent }, //  Default route (Login page)
  { path: 'products', component: ProductManagementComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AdminGuard] }, 
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' } // Redirect any unknown routes to login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
