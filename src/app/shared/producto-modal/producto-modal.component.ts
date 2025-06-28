import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-producto-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto-modal.component.html',
  styleUrl: './producto-modal.component.css'
})
export class ProductoModalComponent {
  @Input() producto: any = null;
  @Input() mostrar: boolean = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() agregar = new EventEmitter<any>();

  constructor(private carritoService: CarritoService) {}

  getNombreCategoria(codigo: string): string {
    const categorias: {[key: string]: string} = {
      'HERRAMIENTAS': 'Herramientas',
      'ELECTRICOS': 'Materiales Eléctricos',
      'FONTANERIA': 'Fontanería',
      'CONSTRUCCION': 'Materiales de Construcción'
    };
    return categorias[codigo] || codigo;
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

  agregarAlCarrito(): void {
    // Emitir el evento de agregar en lugar de llamar directamente al servicio
    this.agregar.emit(this.producto);
    this.cerrarModal(); // Cerrar el modal después de agregar
  }

  /*
  agregarAlCarrito(): void {
    this.carritoService.agregarProducto(this.producto).subscribe({
      next: (response) => {
        console.log('Producto agregado al carrito', response);
        this.cerrar.emit();
      },
      error: (err) => {
        console.error('Error al agregar al carrito', err);
      }
    });
  }
  */
}
