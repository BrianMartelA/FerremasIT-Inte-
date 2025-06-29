import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal-info-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personal-info-modal.component.html',
  styleUrls: ['./personal-info-modal.component.css']
})
export class PersonalInfoModalComponent implements OnInit {
  @Input() user: any;
  @Output() close = new EventEmitter<void>();
  @Output() userUpdated = new EventEmitter<any>(); // Nuevo evento para actualización

  userData: any = {};
  errorMessages: any = {};
  isLoading = false;


  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    if (this.user) {
      // Crear copia profunda de los datos del usuario
      this.userData = {...this.user};
    }
  }

  onSave(): void {
    this.isLoading = true;

    // Crear objeto solo con los campos modificados
    const updateData = {
      first_name: this.userData.first_name,
      last_name: this.userData.last_name,
      second_last_name: this.userData.second_last_name,
      phone: this.userData.phone
    };

    this.apiService.updateUser(updateData).subscribe({
      next: (updatedUser) => {
        this.isLoading = false;
        this.userUpdated.emit(updatedUser); // Emitir usuario actualizado
        this.close.emit();
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
