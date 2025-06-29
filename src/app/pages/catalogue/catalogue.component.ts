import { Component, OnInit } from '@angular/core';
import { SharedModule } from "../../shared/shared.module";
import { ProductoComponent } from '../../shared/producto/producto.component';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { ProductoModalComponent } from '../../shared/producto-modal/producto-modal.component';
import { CarritoService } from '../../services/carrito.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [SharedModule, ProductoComponent, CommonModule, ProductoModalComponent],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.css'
})
export class CatalogueComponent implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  categorias: string[] = ['HERRAMIENTAS', 'ELECTRICOS', 'FONTANERIA', 'CONSTRUCCION'];
  categoriaSeleccionada: string = '';
  loading: boolean = true;
  error: string | null = null;
  mostrarModal: boolean = false;
  productoSeleccionado: any = null;
  searchTerm: string = '';

  constructor(
    private apiService: ApiService,
    private carritoService: CarritoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';

      if (this.searchTerm) {
        this.buscarProductos(this.searchTerm);
      } else {
        this.cargarProductos();
      }
    });
  }

  cargarProductos(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getAllProducts().subscribe({
      next: (data: any) => {
        this.productos = data;
        this.aplicarFiltros();  // Aplicar filtros después de cargar
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'Error al cargar productos. Intente nuevamente.';
        this.loading = false;
      }
    });
  }
   buscarProductos(termino: string): void {
    this.loading = true;
    this.error = null;

    this.apiService.searchProducts(termino).subscribe({
      next: (data: any) => {
        this.productos = data;
        this.productosFiltrados = [...this.productos];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error en búsqueda:', err);
        this.error = 'Error al buscar productos. Intenta nuevamente.';
        this.loading = false;
      }
    });
  }

  seleccionarCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
    this.aplicarFiltros();  // Filtra los productos sin recargar la API
  }

  limpiarFiltros(): void {
    this.categoriaSeleccionada = '';
    this.aplicarFiltros();
    this.router.navigate(['/catalogue']);
  }

  aplicarFiltros(): void {
    if (this.categoriaSeleccionada) {
      // Filtrado local por categoría
      this.productosFiltrados = this.productos.filter(
        producto => producto.categoria === this.categoriaSeleccionada
      );
    } else {
      // Mostrar todos los productos
      this.productosFiltrados = [...this.productos];
    }
  }

  getNombreCategoria(codigo: string): string {
  const nombres: {[key: string]: string} = {
    'HERRAMIENTAS': 'Herramientas',
    'ELECTRICOS': 'Materiales Eléctricos',
    'FONTANERIA': 'Fontanería',
    'CONSTRUCCION': 'Materiales de Construcción'
  };
  return nombres[codigo] || codigo;
  }

  abrirModal(producto: any): void {
    this.productoSeleccionado = producto;
    this.mostrarModal = true;
    document.body.style.overflow = 'hidden'; // Deshabilita el scroll
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    document.body.style.overflow = ''; // Habilita el scroll
  }

  agregarAlCarrito(producto: any): void {
    this.carritoService.agregarProducto(producto).subscribe({
      next: (response) => {
        console.log('Producto añadido al carrito:', response);
        // Actualizar el carrito en toda la aplicación
        this.carritoService.actualizarCarrito();
      },
      error: (err) => {
        console.error('Error al agregar al carrito', err);
      }
    });
  }
  mostrarError(): boolean {
    return !!this.error && !this.loading;
  }
}
