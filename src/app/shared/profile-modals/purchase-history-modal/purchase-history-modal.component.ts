import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-purchase-history-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-history-modal.component.html',
  styleUrl: './purchase-history-modal.component.css'
})
export class PurchaseHistoryModalComponent {
  @Input() orders: any[] = [];
  @Output() close = new EventEmitter<void>(); // Añadir EventEmitter para cerrar

  onClose(): void {
    this.close.emit();
  }
}
