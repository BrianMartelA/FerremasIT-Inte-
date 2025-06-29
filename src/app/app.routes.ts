import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { CatalogueComponent } from './pages/catalogue/catalogue.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { LoginComponent } from './pages/login/login.component';
import { UsersComponent } from './pages/users/users.component';

import { AdminGuard, AuthGuard } from './guards/auth.guard';

import { AdminProductsComponent } from './pages/admin-products/admin-products.component';
import { ProfileComponent } from './pages/profile/profile.component';



export const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard, AdminGuard] // Doble protección
  },
  {path:'home', component:HomeComponent},
  {path:'register',component:RegisterComponent},
  {path:'catalogue', component:CatalogueComponent},
  {path:'payment',component:PaymentComponent},
  {path: 'login', component:LoginComponent},
  {path: 'users', component:UsersComponent},
  { path: 'admin/products',
    component: AdminProductsComponent,
    canActivate: [AuthGuard, AdminGuard] },
  {path:'profile', component:ProfileComponent},
  {path:'',redirectTo:'home', pathMatch:'full'},
];
