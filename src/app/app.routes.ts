import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { CatalogueComponent } from './pages/catalogue/catalogue.component';
import { PaymentComponent } from './pages/payment/payment.component';

export const routes: Routes = [
  {path:'',redirectTo:'home', pathMatch:'full'},
  {path:'home', component:HomeComponent},
  {path:'register',component:RegisterComponent},
  {path:'catalogue', component:CatalogueComponent},
  {path:'payment',component:PaymentComponent}
];
