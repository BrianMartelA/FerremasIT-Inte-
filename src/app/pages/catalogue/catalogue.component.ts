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
  currentPage: number = 1;
  pageSize: number = 9;
  totalProducts: number = 0;
  totalPages: number = 0;


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
      this.categoriaSeleccionada = params['categoria'] || '';
      this.currentPage = +params['page'] || 1;

      if (this.searchTerm) {
        this.buscarProductos(this.searchTerm, this.currentPage);
      } else if (this.categoriaSeleccionada) {
        this.cargarProductosPorCategoria(this.categoriaSeleccionada, this.currentPage);
      } else {
        this.cargarProductos(this.currentPage);
      }
    });
  }

  cargarProductos(page: number = 1): void {  // Añadir parámetro opcional
    this.loading = true;
    this.error = null;

    // Usar el nuevo método paginado
    this.apiService.getPaginatedProducts(page, this.pageSize).subscribe({
      next: (response: any) => {
        this.productos = response.results;
        this.totalProducts = response.count;
        this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
        this.productosFiltrados = [...this.productos];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'Error al cargar productos. Intente nuevamente.';
        this.loading = false;
      }
    });
  }

  buscarProductos(termino: string, page: number = 1): void {  // Añadir parámetro opcional
    this.loading = true;
    this.error = null;

    this.apiService.searchProducts(termino, page, this.pageSize).subscribe({
      next: (response: any) => {  // Usar 'response' en minúsculas
        this.productos = response.results;
        this.totalProducts = response.count;
        this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
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

  cambiarPagina(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;

      // Actualizar URL con todos los parámetros relevantes
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          search: this.searchTerm,
          categoria: this.categoriaSeleccionada,
          page: this.currentPage
        },
        queryParamsHandling: 'merge'
      });

      // Scroll suave al inicio
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  seleccionarCategoria(categoria: string): void {
    // Al seleccionar categoría, reiniciar a página 1
    this.router.navigate(['/catalogue'], {
      queryParams: {
        categoria: categoria,
        page: 1
      }
    });
  }

  cargarProductosPorCategoria(categoria: string, page: number = 1): void {
    this.loading = true;
    this.apiService.getProductsByCategory(categoria, page, this.pageSize).subscribe({
      next: (response: any) => {
        this.productos = response.results;
        this.totalProducts = response.count;
        this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
        this.productosFiltrados = [...this.productos];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos por categoría:', err);
        this.error = 'Error al cargar productos. Intente nuevamente.';
        this.loading = false;
      }
    });
  }

  limpiarFiltros(): void {
    this.categoriaSeleccionada = '';
    // Al limpiar filtros, reiniciar a página 1
    this.router.navigate(['/catalogue'], {
      queryParams: {
        categoria: null,
        page: 1
      },
      queryParamsHandling: 'merge'
    });
  }

  /*
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
  */

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
