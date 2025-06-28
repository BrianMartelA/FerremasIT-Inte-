import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoSubject = new BehaviorSubject<any[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.cargarCarrito();
  }

  private cargarCarrito(): void {
    this.apiService.obtenerCarrito().subscribe({
      next: (carrito) => {
        this.carritoSubject.next(carrito.items || []);
      },
      error: (err) => {
        console.error('Error cargando carrito', err);
        // Manejar error de autenticación
        if (err.status === 401 || err.status === 403) {
          console.log('Usuario no autenticado, redirigiendo a login...');
        }
      }
    });
  }

  agregarProducto(producto: any, cantidad: number = 1): Observable<any> {
    return this.apiService.agregarAlCarrito(producto.id, cantidad).pipe(
      tap(() => this.cargarCarrito()),
      catchError(error => {
        console.error('Error agregando producto', error);
        // Manejar error de autenticación
        if (error.status === 401 || error.status === 403) {
          console.log('Usuario no autenticado, redirigiendo a login...');
        }
        return of(null);
      })
    );
  }

  eliminarProducto(itemId: number): Observable<any> {
    return this.apiService.eliminarDelCarrito(itemId).pipe(
      tap(() => {
        // Actualizar el carrito después de eliminar
        this.cargarCarrito();
      })
    );
  }

  obtenerCarrito(): any[] {
    return this.carritoSubject.value;
  }

  actualizarCarrito(): void {
    this.cargarCarrito();
  }

  /*
  actualizarCarrito(items: any[]): void {
    this.carritoSubject.next(items);
  }
  */
}
