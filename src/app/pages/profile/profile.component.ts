import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { PersonalInfoModalComponent } from '../../shared/profile-modals/personal-info-modal/personal-info-modal.component';
import { SecurityModalComponent } from '../../shared/profile-modals/security-modal/security-modal.component';
import { AccountModalComponent } from '../../shared/profile-modals/account-modal/account-modal.component';
import { AddressModalComponent } from '../../shared/profile-modals/address-modal/address-modal.component';
import { PurchaseHistoryModalComponent } from '../../shared/profile-modals/purchase-history-modal/purchase-history-modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    PersonalInfoModalComponent,
    SecurityModalComponent,
    AccountModalComponent,
    AddressModalComponent,
    PurchaseHistoryModalComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  showPersonalModal = false;
  showAccountModal = false;
  showSecurityModal = false;
  showAddressModal = false;
  orders: any[] = [];
  showHistoryModal = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadOrderHistory();
  }

  loadUserData(): void {
    this.apiService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (error) => {
        console.error('Error cargando datos de usuario', error);
      }
    });
  }

  openModal(type: string): void {
    if (type === 'personal') {
      this.showPersonalModal = true;
    } else if (type === 'account') {
      this.showAccountModal = true;
    } else if (type === 'security') {
      this.showSecurityModal = true;
    } else if (type === 'address') {
      this.showAddressModal = true;
    } else if (type === 'history') {
      this.showHistoryModal = true;
    }
  }

  closeModal(type: string): void {
    if (type === 'personal') {
      this.showPersonalModal = false;
    } else if (type === 'account') {
      this.showAccountModal = false;
    } else if (type === 'security') {
      this.showSecurityModal = false;
    } else if (type === 'address') {
      this.showAddressModal = false;
    } else if (type === 'history') {
      this.showHistoryModal = false;
    }
  }

  //handleUserUpdated(updatedUser: any): void {
    // Actualizar solo los campos relevantes
  //  this.user = {
  //    ...this.user,
  //    ...updatedUser
  //  };
  //}
  handleUserUpdated(updatedUser: any): void {
  // Actualizar todos los campos del usuario
    this.user = {
      ...this.user,
      ...updatedUser,
      // Calcular nombre_completo si no viene del backend
      nombre_completo: updatedUser.nombre_completo ||
                      [updatedUser.first_name, updatedUser.last_name, updatedUser.second_last_name]
                      .filter(Boolean).join(' ')
    };
  }

  loadOrderHistory(): void {
    this.apiService.getOrderHistory().subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (error) => {
        console.error('Error cargando historial', error);
      }
    });
  }
}

