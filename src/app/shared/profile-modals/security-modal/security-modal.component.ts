import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-security-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './security-modal.component.html',
  styleUrls: ['./security-modal.component.css']
})
export class SecurityModalComponent {
  @Output() close = new EventEmitter<void>();


  passwordForm;
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder, // Inyectar FormBuilder
    private apiService: ApiService
  ) {
    // Inicializar en el constructor
    this.passwordForm = this.fb.group({
      old_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', Validators.required]
    });
  }

onSubmit(): void {
  if (this.passwordForm.invalid) return;
  if (this.passwordForm.value.new_password !== this.passwordForm.value.confirm_password) {
    this.errorMessage = 'Las contraseñas no coinciden';
    return;
  }

  this.isLoading = true;
  this.apiService.changePassword({
    old_password: this.passwordForm.value.old_password,
    new_password: this.passwordForm.value.new_password
  }).subscribe({
    next: () => {
      this.isLoading = false;
      this.successMessage = 'Contraseña cambiada exitosamente';
      setTimeout(() => {
        this.close.emit();
      }, 1500);
    },
    error: (error) => {
      this.isLoading = false;
      // Manejar diferentes tipos de errores
      if (error.error.old_password) {
        this.errorMessage = error.error.old_password[0];
      } else {
        this.errorMessage = error.error.message || 'Error al cambiar la contraseña';
      }
    }
  });
}

  onClose(): void {
    this.close.emit();
  }
}
