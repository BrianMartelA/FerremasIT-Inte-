import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CarritoService } from '../../services/carrito.service';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  carrito: any[] = [];
  total: number = 0;
  loading: boolean = true;

  constructor(
    private carritoService: CarritoService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carritoService.carrito$.subscribe(items => {
      this.carrito = items;
      this.total = this.calcularTotal();
      this.loading = false;
    });
  }

  calcularTotal(): number {
    return this.carrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
  }

  eliminarItem(itemId: number): void {
    this.carritoService.eliminarProducto(itemId).subscribe({
      next: () => {
        console.log('Producto eliminado del carrito');
      },
      error: (err) => {
        console.error('Error eliminando producto', err);
      }
    });
  }

  realizarPago(): void {
  if (this.carrito.length === 0) return;

    this.apiService.procesarPago().subscribe({
      next: (response) => {
        console.log('Pago exitoso', response);
        this.carritoService.actualizarCarrito();

        // Redirigir con estado
        this.router.navigate(['/confirmacion'], {
          state: { ordenId: response.orden_id }
        });
      },
      error: (err) => {
        console.error('Error en el pago', err);
        alert('Error: ' + (err.error?.error || 'Error desconocido'));
      }
    });
  }
}

