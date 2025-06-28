import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  contadorCarrito: number = 0;

  constructor(
    public authService: AuthService,
    private router: Router,
    private carritoService: CarritoService
  ) {
    this.carritoService.carrito$.subscribe(items => {
      this.contadorCarrito = items.reduce((sum, item) => sum + item.cantidad, 0);
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

}
