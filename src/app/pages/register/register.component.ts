import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms'; // ✅ Importar aquí
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule,FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {constructor(private api: ApiService) {}

user: {
  first_name: string;
  last_name: string;
  second_last_name: string;
  rut: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  conf_pass?: string; // 👈 esta propiedad ahora es opcional
} = {
  first_name: '',
  last_name: '',
  second_last_name: '',
  rut: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  conf_pass: ''
};

onRegister() {
  const payload = { ...this.user };

  // Validar que ambas contraseñas coincidan antes de enviar
  if (payload.password !== payload.conf_pass) {
    alert('Las contraseñas no coinciden');
    return;
  }

  this.api.register(payload).subscribe({
    next: (res: any) => {
      console.log('Registro exitoso', res);
      // Redireccionar o mostrar éxito
    },
    error: (err: any) => {
      console.error('Error en el registro', err);
    }
  });
}

}
