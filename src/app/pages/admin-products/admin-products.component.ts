import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
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
  isLoading = true;

  // Variables para modales
  showEditModal = false;
  showCreateModal = false;
  showDeleteModal = false;
  selectedProduct: any = null;
  productToDelete: any = null;
  newProduct: any = {
    nombre: '',
    categoria: '',
    stock: null,
    precio: null,
    descripcion: '',
    imagen: null
  };

  // Para previsualización de imágenes
  URL = window.URL || window.webkitURL;

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
    this.isLoading = true;
    this.apiService.getProducts(this.currentPage, this.itemsPerPage, this.searchTerm).subscribe({
      next: (response: any) => {
        if (response.results) {
          this.products = response.results;
          this.totalItems = response.count;
        } else {
          this.products = response;
          this.totalItems = response.length;
        }

        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updateFilledProducts();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando productos', err);
        this.isLoading = false;
      }
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
          precio: '---',
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
    this.selectedProduct = null;
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.resetNewProduct();
  }

  openDeleteModal(product: any) {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.productToDelete) {
      this.apiService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.loadProducts();
          this.closeDeleteModal();
        },
        error: (err) => console.error('Error eliminando producto', err)
      });
    }
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.productToDelete = null;
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
    formData.append('stock', this.newProduct.stock.toString());
    formData.append('precio', this.newProduct.precio.toString());
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
  formData.append('stock', this.selectedProduct.stock.toString());
  formData.append('precio', this.selectedProduct.precio.toString());
  formData.append('descripcion', this.selectedProduct.descripcion);

  // Manejar imagen solo si se proporciona una nueva
  if (this.selectedProduct.imagen instanceof File) {
    formData.append('imagen', this.selectedProduct.imagen);
  } else if (this.selectedProduct.imagen === null) {
    // Si se eliminó la imagen existente
    formData.append('imagen', '');
  }

  this.apiService.updateProduct(this.selectedProduct.id, formData).subscribe({
    next: () => {
      this.closeEditModal();
      this.loadProducts();
    },
    error: (err) => console.error('Error actualizando producto', err)
  });
}

  getCategoryLabel(value: string): string {
    const category = this.categories.find(cat => cat.value === value);
    return category ? category.label : value;
  }

  getImageUrl(imagePath: string): string {
    return `http://localhost:8000${imagePath}`;
  }

  isImageString(image: any): boolean {
    return typeof image === 'string';
  }
}
