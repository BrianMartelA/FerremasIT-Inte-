import { ApiService } from './../../services/api.service';
import { Component } from '@angular/core';
import { FormGroup, FormsModule, Validators, FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from "../../shared/header/header.component";
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, SharedModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.apiService.login(email, password).subscribe({
        next: (response) => {
          // Guardar token y datos de usuario
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));

          // Redirigir al catálogo
          this.router.navigate(['/catalogue']);
        },
        error: (err) => {
          console.error('Error en login:', err);
          this.errorMessage = 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}


