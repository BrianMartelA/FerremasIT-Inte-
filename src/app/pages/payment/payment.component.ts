import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CarritoService } from '../../services/carrito.service';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { NgxPayPalModule } from 'ngx-paypal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [SharedModule, CommonModule, NgxPayPalModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  carrito: any[] = [];
  total: number = 0;
  loading: boolean = true;

  payPalConfig: any;
  showPaypalButtons = false;

  constructor(
    private apiService: ApiService,
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initPaypalConfig();
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

  initPaypalConfig() {
    this.showPaypalButtons = false;
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.apiService.createPayPalPayment().subscribe({
      next: (res: any) => {
        this.payPalConfig = {
          clientId: 'sb', // Usar 'sb' para sandbox
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: (this.total / 800).toFixed(2), // Convertir CLP a USD
                  currency_code: 'USD'
                }
              }]
            });
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              alert('Pago exitoso: ' + details.payer.name.given_name);
              // Guardar orden en base de datos
            });
          },
          onError: (err: any) => {
            console.error('Error en pago PayPal:', err);
          }
        };
        this.showPaypalButtons = true;
      },
      error: (err) => {
      if (err.status === 401 || err.status === 403) {
        // Token inválido, redirigir a login
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
      } else {
        console.error('Error creando pago:', err);
      }
    }
  });
    setTimeout(() => {
    this.showPaypalButtons = true;
    }, 1000);
  }
}

