import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms'; // ✅ Importar aquí
import { ApiService } from '../../services/api.service';
import { NgIf, NgFor } from '@angular/common';

   import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule,FormsModule,NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {constructor(private api: ApiService, private router:Router) {}

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
  acceptedTerms: boolean;
} = {
  first_name: '',
  last_name: '',
  second_last_name: '',
  rut: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  conf_pass: '',
  acceptedTerms:false
};

errorMessages: { [key: string]: string } = {};


onRegister() {
  const payload = { ...this.user };

  // Validar que ambas contraseñas coincidan antes de enviar
  if (payload.password !== payload.conf_pass) {
    alert('Las contraseñas no coinciden');
    return;
  }

 this.api.register(payload).subscribe({
    next: (res) => {
      console.log('Registro exitoso', res);
      this.errorMessages = {};
      this.user={
        first_name:"",
        last_name:"",
        second_last_name:"",
        rut:"",
        email:"",
        phone:"",
        address:"",
        password:"",
        conf_pass:"",
        acceptedTerms:false
      }
    },
    error: (err) => {
      if (err.status === 400 && err.error) {
        for (const key in err.error) {
          if (err.error.hasOwnProperty(key)) {
            this.errorMessages[key] = err.error[key][0];
          }
        }
      } else {
        this.errorMessages['general'] = 'Error inesperado.';
      }
    }
  });
}
clearError(field: string) {
  delete this.errorMessages[field];
}

allowOnlyNumbers(event: KeyboardEvent) {
  const charCode = event.key.charCodeAt(0);
  if (charCode < 48 || charCode > 57) {
    event.preventDefault(); // Bloquea letras y símbolos
  }
}

allowOnlyLetters(event: KeyboardEvent) {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
  if (!regex.test(event.key)) {
    event.preventDefault();
  }
}

}
