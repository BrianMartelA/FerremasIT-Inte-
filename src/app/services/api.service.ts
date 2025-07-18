import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
  getAllProducts(): Observable<any> {
  return this.http.get(`${this.baseUrl}/productos/all/`);
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

  /*
  getProductos(): Observable<any> {
  return this.http.get(`${this.baseUrl}/productos/`);
  }
  */

  obtenerCarrito(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/carrito/`, { headers });
  }

  agregarAlCarrito(productoId: number, cantidad: number = 1): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/carrito/agregar/`, {
      producto_id: productoId,
      cantidad: cantidad
    }, { headers });
  }

  eliminarDelCarrito(itemId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/carrito/eliminar/${itemId}/`, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        'Authorization': `Token ${token}`
      });
    }
    return new HttpHeaders();
  }


  searchProducts(query: string, page: number = 1, pageSize: number = 9): Observable<any> {
  const params = {
    q: query,
    page: page.toString(),
    page_size: pageSize.toString()
  };
  return this.http.get(`${this.baseUrl}/productos/search/`, { params }).pipe(
    catchError(error => {
      // Manejar errores específicos
      let errorMessage = 'Error desconocido';
      if (error.status === 404) {
        errorMessage = 'No se encontraron productos';
      } else if (error.status >= 500) {
        errorMessage = 'Error del servidor. Intente más tarde';
      }
      return throwError(() => new Error(errorMessage));
    })
  );
  }

  getPaginatedProducts(page: number = 1, pageSize: number = 9): Observable<any> {
  const params = {
    page: page.toString(),
    page_size: pageSize.toString()
  };
  return this.http.get(`${this.baseUrl}/productos/paginados/`, { params });
  }

  getProductsByCategory(category: string, page: number = 1, pageSize: number = 9): Observable<any> {
  const params = {
    categoria: category,
    page: page.toString(),
    page_size: pageSize.toString()
  };
  return this.http.get(`${this.baseUrl}/productos/por-categoria/`, { params });
  }

  getCurrentUser(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/user/me/`, { headers });
  }

  //updateUser(userData: any): Observable<any> {
  //  const headers = this.getAuthHeaders();
    // Usar PATCH para actualización parcial
  //  return this.http.patch(`${this.baseUrl}/user/me/`, userData, { headers });
  //}

  updateUser(userData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.baseUrl}/user/me/`, userData, { headers });
  }

  changePassword(passwordData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/user/change_password/`, passwordData, { headers });
  }

  procesarPago(): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.post(`${this.baseUrl}/carrito/procesar-pago/`, {}, { headers });
  }

  getOrderHistory(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/ordenes/`, { headers });
  }
}

