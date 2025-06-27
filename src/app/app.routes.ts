import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { CatalogueComponent } from './pages/catalogue/catalogue.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { LoginComponent } from './pages/login/login.component';
import { UsersComponent } from './pages/users/users.component';
import { AdminProductsComponent } from './pages/admin-products/admin-products.component';


export const routes: Routes = [
  {path:'',redirectTo:'home', pathMatch:'full'},
  {path:'home', component:HomeComponent},
  {path:'register',component:RegisterComponent},
  {path:'catalogue', component:CatalogueComponent},
  {path:'payment',component:PaymentComponent},
  {path: 'login', component:LoginComponent},
  {path: 'users', component:UsersComponent},
  { path: 'admin/products', component: AdminProductsComponent }
];
