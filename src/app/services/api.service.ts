import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

 private baseUrl = 'http://localhost:8000/api'; ///quite el /auth del final de la URL

  constructor(private http: HttpClient) {}

  getHello() {
    return this.http.get('http://localhost:8000/api/hello/');
  }

  register(payload: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/auth/register/`, payload); ///añadi el auth al URL
  }

   // Método para obtener todos los productos
  getProductos(): Observable<any> {
    // Ahora apunta a /api/productos/ correctamente
    return this.http.get(`${this.baseUrl}/productos/`);
  }

  // Método para obtener productos por categoría
  getProductosPorCategoria(categoria: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/productos/?categoria=${categoria}`);
  }

}
