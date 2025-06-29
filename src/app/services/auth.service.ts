import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  login(email: string, password: string): Observable<any> {
  return this.apiService.login(email, password).pipe(
    tap(response => {
      // Guardar token en localStorage
      localStorage.setItem('token', response.token);

      // Guardar información del usuario si es necesario
      localStorage.setItem('user', JSON.stringify(response.user));
    })
  );
}

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.is_staff : false;
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

}

