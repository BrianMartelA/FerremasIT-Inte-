import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

 private baseUrl = 'http://localhost:8000/api/auth';

  constructor(private http: HttpClient) {}

  getHello() {
    return this.http.get('http://localhost:8000/api/hello/');
  }

  register(payload: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/register/`, payload);
}


}
