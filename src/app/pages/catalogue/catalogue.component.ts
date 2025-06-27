import { Component, OnInit } from '@angular/core';
import { SharedModule } from "../../shared/shared.module";
import { HeaderComponent } from "../../shared/header/header.component";
import { ProductoComponent } from '../../shared/producto/producto.component';
import { CommonModule } from '@angular/common'; // Añade esta importación
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [SharedModule, ProductoComponent, CommonModule],
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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getProductos().subscribe({
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

  seleccionarCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
    this.aplicarFiltros();  // Filtra los productos sin recargar la API
  }

  limpiarFiltros(): void {
    this.categoriaSeleccionada = '';
    this.aplicarFiltros();
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
}
