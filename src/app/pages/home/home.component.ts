import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private api = inject(ApiService);
  mensaje = '';

  constructor() {
    this.api.getHello().subscribe({
   next: (data: any) => this.mensaje = data.message,
    error: () => this.mensaje = 'Error al conectar con Django'
});
  }
}
