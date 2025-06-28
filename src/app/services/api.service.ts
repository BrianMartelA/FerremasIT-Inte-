import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

 private baseUrl = 'http://localhost:8000/api'; ///quite el /auth del final de la URL


  constructor(private http: HttpClient) {}

  getHello() {
    return this.http.get<{message: string}>(`${this.baseUrl}/hello/`);
  }

  register(payload: any): Observable<any> {

  return this.http.post(`${this.baseUrl}/register/`, payload);
  }

   // Método para obtener todos los productos
  getProductos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/productos/`);
  }

  // Método para obtener productos por categoría
  getProductosPorCategoria(categoria: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/productos/?categoria=${categoria}`);
  }

  getUsers(): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Token ${token}`
  });
  return this.http.get(`${this.baseUrl}/users/`, { headers });
 }

  deleteUser(userId: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Token ${token}`
  });
  return this.http.delete(`${this.baseUrl}/users/${userId}/`, { headers });
}

  login(email: string, password: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/auth/login/`, {
    username: email,  // Cambiar de 'email' a 'username'
    password
  });
}
}
