import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent {
  @Input() imagenUrl: string = '';
  @Input() titulo: string = 'Producto';
  @Input() precio: number = 0;
  @Input() producto: any;
  @Output() clickProducto = new EventEmitter<any>();

  abrirModal(): void {
    this.clickProducto.emit(this.producto);
  }
}
