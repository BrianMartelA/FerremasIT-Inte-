import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms'; // Para ngModel si eso
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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.apiService.getUsers().subscribe({
      next: (data: any) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
        this.isLoading = false;
      }
    });
  }

  openDeleteDialog(userId: number) {
    this.userToDelete = userId;
    this.confirmDialog.nativeElement.showModal();
  }

  confirmDelete() {
    if (this.userToDelete) {
      this.apiService.deleteUser(this.userToDelete).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== this.userToDelete);
          this.closeDialog();
        },
        error: (err) => {
          console.error('Error eliminando usuario', err);
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
