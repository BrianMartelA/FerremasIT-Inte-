import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  contadorCarrito: number = 0;
  terminoBusqueda: string = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private carritoService: CarritoService
  ) {
    this.carritoService.carrito$.subscribe(items => {
      this.contadorCarrito = items.reduce((sum, item) => sum + item.cantidad, 0);
    });
  }

  buscar(): void {
    if (this.terminoBusqueda.trim()) {
      this.router.navigate(['/catalogue'], {
        queryParams: { search: this.terminoBusqueda.trim() }
      });
      this.terminoBusqueda = ''; // Limpiar el campo
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

}
