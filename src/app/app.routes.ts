import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { CatalogueComponent } from './pages/catalogue/catalogue.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { LoginComponent } from './pages/login/login.component';
import { UsersComponent } from './pages/users/users.component';
import { AdminGuard, AuthGuard } from './guards/auth.guard';



export const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard, AdminGuard] // Doble protección
  },
  {path:'',redirectTo:'home', pathMatch:'full'},
  {path:'home', component:HomeComponent},
  {path:'register',component:RegisterComponent},
  {path:'catalogue', component:CatalogueComponent},
  {path:'payment',component:PaymentComponent},
  {path: 'login', component:LoginComponent},
  {path: 'users', component:UsersComponent}
];
