import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  //ALVARO AGREGA
  getProducts(page: number = 1, pageSize: number = 6, search: string = ''): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    const params = {
      page: page.toString(),
      page_size: pageSize.toString(),
      search: search
    };

    return this.http.get(`${this.baseUrl}/productos/`, { headers, params });
  }

  createProduct(productData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });
    return this.http.post(`${this.baseUrl}/productos/`, productData, { headers });
  }

  updateProduct(id: number, productData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });
    return this.http.patch(`${this.baseUrl}/productos/${id}/`, productData, { headers });
  }

  deleteProduct(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });
    return this.http.delete(`${this.baseUrl}/productos/${id}/`, { headers });
  }

  getUsers(page: number = 1, pageSize: number = 6, search: string = ''): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Token ${token}`
  });

  const params = {
    page: page.toString(),
    page_size: pageSize.toString(),
    search: search
  };

  return this.http.get(`${this.baseUrl}/users/`, { headers, params });
}

  deleteUser(userId: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Token ${token}`
  });
  return this.http.delete(`${this.baseUrl}/users/${userId}/`, { headers });
}

  toggleAdminStatus(userId: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Token ${token}`
  });
  return this.http.patch(`${this.baseUrl}/users/${userId}/toggle-admin/`, {}, { headers });
}


  login(email: string, password: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/auth/login/`, {
    username: email,
    password
  }).pipe(
    tap((response: any) => {
      // Guardar token
      localStorage.setItem('token', response.token);

      // Guardar usuario actual
      if (response.user) {
        localStorage.setItem('currentUser', JSON.stringify(response.user));
      } else {
        // Si el backend no devuelve el objeto user completo
        // Intentar construir un objeto mínimo con la información disponible
        const userData = {
          id: response.user_id || response.id || null,
          email: email,
          is_staff: response.is_staff || false
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
      }
    })
  );
}
}
