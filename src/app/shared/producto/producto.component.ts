import { Component, Input } from '@angular/core';

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
  @Input() stock: number = 0;
}
