import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EliminarService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  eliminarUsuario(usuarioId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${usuarioId}`);
  }
}
