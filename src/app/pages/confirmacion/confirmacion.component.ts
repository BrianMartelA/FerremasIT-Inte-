import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './confirmacion.component.html',
  styleUrl: './confirmacion.component.css'
})
export class ConfirmacionComponent {
  ordenId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    const navigation = window.history.state;
    if (navigation && navigation.ordenId) {
      this.ordenId = navigation.ordenId;
    }
  }

  navigateToCatalogue() {
    this.router.navigate(['/catalogue']);
  }
}
