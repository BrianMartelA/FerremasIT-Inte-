import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    this.agregar.emit(this.producto);
  }
}
