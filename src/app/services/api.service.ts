import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getHello() {
    return this.http.get<{message: string}>(`${this.baseUrl}/hello/`);
  }

  register(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/`, payload);
  }

  getUsers() {
    return this.http.get(`${this.baseUrl}/users/`);
  }

  deleteUser(userId: number) {
    return this.http.delete(`${this.baseUrl}/users/${userId}/`);
  }
}
