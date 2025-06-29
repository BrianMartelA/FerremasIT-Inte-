import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-modal.component.html',
  styleUrls: ['./account-modal.component.css']
})
export class AccountModalComponent implements OnInit {
  @Input() user: any;
  @Output() close = new EventEmitter<void>();
  @Output() userUpdated = new EventEmitter<any>(); // Nuevo evento para actualización

  accountForm: any;
  errorMessages: any = {};
  successMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.accountForm = this.fb.group({
      email: [this.user?.email || '', [Validators.required, Validators.email]]
    });
  }

  onSave(): void {
    if (this.accountForm.invalid) return;

    this.isLoading = true;

    // Crear objeto solo con el campo modificado
    const updateData = {
      email: this.accountForm.value.email
    };

    this.apiService.updateUser(updateData).subscribe({
      next: (updatedUser) => {
        this.isLoading = false;
        this.successMessage = 'Email actualizado exitosamente';
        this.userUpdated.emit(updatedUser); // Emitir usuario actualizado

        setTimeout(() => {
          this.close.emit();
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessages = error.error;
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
