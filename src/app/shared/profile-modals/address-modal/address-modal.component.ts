import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-address-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address-modal.component.html',
  styleUrls: ['./address-modal.component.css']
})
export class AddressModalComponent implements OnInit {
  @Input() user: any;
  @Output() close = new EventEmitter<void>();
  @Output() userUpdated = new EventEmitter<any>(); // Nuevo evento para actualización

  addressForm: any;
  errorMessages: any = {};
  successMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      address: [this.user?.address || '', Validators.required]
    });
  }

  onSave(): void {
    if (this.addressForm.invalid) return;

    this.isLoading = true;

    // Crear objeto solo con el campo modificado
    const updateData = {
      address: this.addressForm.value.address
    };

    this.apiService.updateUser(updateData).subscribe({
      next: (updatedUser) => {
        this.isLoading = false;
        this.successMessage = 'Dirección actualizada exitosamente';
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
