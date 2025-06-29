import { Component, inject, Input } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { ProductoComponent } from '../../shared/producto/producto.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private api = inject(ApiService);
  mensaje = '';

  // Array de productos desde la base de datos
  productos: any[] = [];
  productosCarousel: any[] = [];
  productosDestacados: any[] = [];
  isLoading = true;

  constructor() {}
 currentSlide = 0;
  private slideInterval: any;
  ngOnInit() {
    this.cargarProductos();
    this.startCarousel();

  }
startCarousel() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 4000); // Cambia cada 4 segundos
  }

  nextSlide() {
    if (this.productosCarousel.length > 0) {
      this.currentSlide = (this.currentSlide + 1) % this.productosCarousel.length;
    }
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  cargarProductos() {
    this.api.getAllProducts().subscribe({
      next: (data) => {
        this.productos = data;
        // Separar productos para carousel (primeros 3) y destacados (siguientes 2)
        this.productosCarousel = this.productos.slice(0, 3);
        this.productosDestacados = this.productos.slice(3, 5);
        this.isLoading = false;
        console.log('Productos cargados:', this.productos);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.isLoading = false;
      }
    });
  }
}
