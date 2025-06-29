import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @ViewChild('confirmDialog') confirmDialog!: any;
  users: any[] = [];      // Usuarios reales de la API
  displayedUsers: any[] = []; // Usuarios para mostrar (con relleno)
  isLoading = true;
  userToDelete: number | null = null;

  // Variables para paginación y búsqueda
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  searchTerm: string = '';
  totalPages: number = 1;
  isUpdating: { [key: number]: boolean } = {};
  constructor(private apiService: ApiService) {}

  currentUser: any = null; // Usuario actualmente autenticado


  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadUsers();
  }

  loadCurrentUser() {
  const userJson = localStorage.getItem('currentUser');
  if (userJson) {
    try {
      this.currentUser = JSON.parse(userJson);
      console.log('Usuario actual cargado:', this.currentUser);
      // Asegurar que el ID es número
      if (this.currentUser.id) {
        this.currentUser.id = Number(this.currentUser.id);
      }
    } catch (e) {
      console.error('Error parsing currentUser', e);
      this.currentUser = null;
    }
  } else {
    this.currentUser = null;
  }
}
  loadUsers() {
    this.isLoading = true;
    this.apiService.getUsers(this.currentPage, this.itemsPerPage, this.searchTerm).subscribe({
      next: (response: any) => {
        this.users = response.results;
        this.totalItems = response.count;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

        // Actualizar displayedUsers con relleno
        this.updateDisplayedUsers();

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
        this.isLoading = false;
      }
    });
  }

  isCurrentUser(userId: number): boolean {
  if (!this.currentUser) return false;

  // Convertir ambos a número para comparar
  const currentUserId = Number(this.currentUser.id);
  return currentUserId === userId;
  }

  updateDisplayedUsers() {
    this.displayedUsers = [...this.users];
    const emptySlots = 6 - this.users.length;

    if (emptySlots > 0) {
      for (let i = 0; i < emptySlots; i++) {
        this.displayedUsers.push({
          id: null,
          tipo_usuario: '---',
          nombre_completo: '---',
          rut: '---',
          fecha_ingreso: '---',
          email: '---',
          phone: '---',
          is_empty: true
        });
      }
    }
  }

  toggleAdminStatus(userId: number) {
    this.isUpdating[userId] = true;

    this.apiService.toggleAdminStatus(userId).subscribe({
      next: () => {
        // Actualizar el usuario en la lista real
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
          this.users[userIndex].tipo_usuario =
            this.users[userIndex].tipo_usuario === 'Administrador' ? 'Cliente' : 'Administrador';

          // Actualizar la lista de visualización
          this.updateDisplayedUsers();
        }
        this.isUpdating[userId] = false;
      },
      error: (err) => {
        console.error('Error cambiando estado de admin', err);
        this.isUpdating[userId] = false; // Asegurar limpieza

        // Manejo específico de errores
        if (err.status === 403) {
          alert('No tienes permiso para realizar esta acción');
        } else {
          alert('Error al cambiar el estado de administrador');
        }
      },
      complete: () => {
        this.isUpdating[userId] = false; // Limpiar siempre
      }
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadUsers();
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }

  openDeleteDialog(userId: number) {
    this.userToDelete = userId;
    this.confirmDialog.nativeElement.showModal();
  }

  confirmDelete() {
    if (this.userToDelete) {
      this.apiService.deleteUser(this.userToDelete).subscribe({
        next: () => {
          this.loadUsers();
          this.closeDialog();
        },
        error: (err) => {
          console.error('Error eliminando usuario', err);
          if (err.status === 403) {
            alert('No tienes permiso para realizar esta acción');
          }
          this.closeDialog();
        }
      });
    }
  }

  closeDialog() {
    this.userToDelete = null;
    this.confirmDialog.nativeElement.close();
  }
}
