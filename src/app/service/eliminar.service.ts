import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EliminarService {
  private apiUrl = 'https://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  eliminarUsuario(usuarioId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/${usuarioId}`, { headers });
  }
}
