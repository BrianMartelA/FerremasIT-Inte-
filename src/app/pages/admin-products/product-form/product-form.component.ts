import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  @Input() product: any;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() submit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  productForm: FormGroup;
  imageFile: File | null = null;
  categories = [
    { value: 'HERRAMIENTAS', label: 'Herramientas' },
    { value: 'ELECTRICOS', label: 'Materiales Eléctricos' },
    { value: 'FONTANERIA', label: 'Fontanería' },
    { value: 'CONSTRUCCION', label: 'Materiales de Construcción' }
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      descripcion: [''],
      imagen: [null]
    });
  }

  ngOnChanges() {
    if (this.product) {
      this.productForm.patchValue({
        nombre: this.product.nombre,
        categoria: this.product.categoria,
        stock: this.product.stock,
        precio: this.product.precio,
        descripcion: this.product.descripcion
      });
    } else if (this.mode === 'create') {
      this.productForm.reset();
    }
  }

  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    const formData = new FormData();
    formData.append('nombre', this.productForm.value.nombre);
    formData.append('categoria', this.productForm.value.categoria);
    formData.append('stock', this.productForm.value.stock);
    formData.append('precio', this.productForm.value.precio);
    formData.append('descripcion', this.productForm.value.descripcion || '');

    if (this.imageFile) {
      formData.append('imagen', this.imageFile);
    }

    if (this.mode === 'create') {
      this.apiService.createProduct(formData).subscribe({
        next: () => this.submit.emit(),
        error: (err) => console.error('Error creating product', err)
      });
    } else if (this.mode === 'edit' && this.product) {
      this.apiService.updateProduct(this.product.id, formData).subscribe({
        next: () => this.submit.emit(),
        error: (err) => console.error('Error updating product', err)
      });
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
