import { SharedModule } from '../../shared/shared.module';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: any[] = [];
  currentPage = 1;
  itemsPerPage = 6;
  totalItems = 0;
  searchTerm = '';
  totalPages = 1;
  filledProducts: any[] = [];

  // Variables para modales
  showEditModal = false;
  showCreateModal = false;
  selectedProduct: any = null;
  newProduct: any = {
    nombre: '',
    categoria: '',
    stock: null,
    precio: null,
    descripcion: '',
    imagen: null
  };

  // Categorías para el select
  categories = [
    { value: 'HERRAMIENTAS', label: 'Herramientas' },
    { value: 'ELECTRICOS', label: 'Materiales Eléctricos' },
    { value: 'FONTANERIA', label: 'Fontanería' },
    { value: 'CONSTRUCCION', label: 'Materiales de Construcción' }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.apiService.getProducts(this.currentPage, this.itemsPerPage, this.searchTerm).subscribe({
      next: (response: any) => {
        this.products = response.results || response; // Depende de tu estructura de respuesta
        this.totalItems = response.count || this.products.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updateFilledProducts();
      },
      error: (err) => console.error('Error cargando productos', err)
    });
  }

  updateFilledProducts() {
    this.filledProducts = [...this.products];
    const emptySlots = this.itemsPerPage - this.products.length;
    if (emptySlots > 0) {
      for (let i = 0; i < emptySlots; i++) {
        this.filledProducts.push({
          id: null,
          nombre: '---',
          categoria: '---',
          fecha_creacion: '---',
          stock: '---',
          is_empty: true
        });
      }
    }
  }

  onSearch() {
    this.currentPage = 1;
    this.loadProducts();
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  openEditModal(product: any) {
    this.selectedProduct = { ...product };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.resetNewProduct();
  }

  resetNewProduct() {
    this.newProduct = {
      nombre: '',
      categoria: '',
      stock: null,
      precio: null,
      descripcion: '',
      imagen: null
    };
  }

  onFileChange(event: any, isNew: boolean = true) {
    const file = event.target.files[0];
    if (file) {
      if (isNew) {
        this.newProduct.imagen = file;
      } else {
        this.selectedProduct.imagen = file;
      }
    }
  }

  createProduct() {
    const formData = new FormData();
    formData.append('nombre', this.newProduct.nombre);
    formData.append('categoria', this.newProduct.categoria);
    formData.append('stock', this.newProduct.stock);
    formData.append('precio', this.newProduct.precio);
    formData.append('descripcion', this.newProduct.descripcion);
    if (this.newProduct.imagen) {
      formData.append('imagen', this.newProduct.imagen);
    }

    this.apiService.createProduct(formData).subscribe({
      next: () => {
        this.closeCreateModal();
        this.loadProducts();
      },
      error: (err) => console.error('Error creando producto', err)
    });
  }

  updateProduct() {
    const formData = new FormData();
    formData.append('nombre', this.selectedProduct.nombre);
    formData.append('categoria', this.selectedProduct.categoria);
    formData.append('stock', this.selectedProduct.stock);
    formData.append('precio', this.selectedProduct.precio);
    formData.append('descripcion', this.selectedProduct.descripcion);
    if (this.selectedProduct.imagen instanceof File) {
      formData.append('imagen', this.selectedProduct.imagen);
    }

    this.apiService.updateProduct(this.selectedProduct.id, formData).subscribe({
      next: () => {
        this.closeEditModal();
        this.loadProducts();
      },
      error: (err) => console.error('Error actualizando producto', err)
    });
  }

  deleteProduct(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.apiService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => console.error('Error eliminando producto', err)
      });
    }
  }

  getCategoryLabel(value: string): string {
  const category = this.categories.find(cat => cat.value === value);
  return category ? category.label : value;
  }
}
