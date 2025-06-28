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
  users: any[] = [];
  isLoading = true;
  userToDelete: number | null = null;

  // Variables para paginación y búsqueda
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  searchTerm: string = '';
  totalPages: number = 1;
  filledUsers: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.apiService.getUsers(this.currentPage, this.itemsPerPage, this.searchTerm).subscribe({
      next: (response: any) => {
        this.users = response.results;
        this.totalItems = response.count;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

        // Crear lista de usuarios con relleno para mantener siempre 6 filas
        this.filledUsers = [...this.users];
        const emptySlots = 6 - this.users.length;

        if (emptySlots > 0) {
          for (let i = 0; i < emptySlots; i++) {
            this.filledUsers.push({
              id: null,
              tipo_usuario: '---',
              nombre_completo: '---',
              rut: '---',
              fecha_ingreso: '---',
              email: '---',
              phone: '---',
              is_empty: true // Bandera para identificar filas vacías
            });
          }
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
        this.isLoading = false;
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
