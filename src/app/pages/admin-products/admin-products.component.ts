import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductDeleteComponent } from './product-delete/product-delete.component';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ProductFormComponent,
    ProductDeleteComponent
  ],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: any[] = [];
  isLoading = true;
  showFormModal = false;
  showDeleteModal = false;
  currentProduct: any = null;
  formMode: 'create' | 'edit' = 'create';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.apiService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.isLoading = false;
      }
    });
  }

  openCreateModal() {
    this.formMode = 'create';
    this.currentProduct = null;
    this.showFormModal = true;
  }

  openEditModal(product: any) {
    this.formMode = 'edit';
    this.currentProduct = { ...product };
    this.showFormModal = true;
  }

  openDeleteModal(product: any) {
    this.currentProduct = product;
    this.showDeleteModal = true;
  }

  handleFormSubmit() {
    this.showFormModal = false;
    this.loadProducts();
  }

  handleDeleteConfirm() {
    if (this.currentProduct) {
      this.apiService.deleteProduct(this.currentProduct.id).subscribe({
        next: () => {
          this.showDeleteModal = false;
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error deleting product', err);
          this.showDeleteModal = false;
        }
      });
    }
  }

  closeModals() {
    this.showFormModal = false;
    this.showDeleteModal = false;
  }
}
