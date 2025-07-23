import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObtenerService {
  private apiUrlUsuarios = 'https://localhost:3000/api/personas';
  private apiUrlTiposUsuarios = 'https://localhost:3000/api/Tpersonas';
  private apiUrlSesiones = 'https://localhost:3000/api/sesiones';

  constructor(private http: HttpClient) {}

  obtenerUsuarios(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(this.apiUrlUsuarios, { headers });
  }

  obtenerSesiones(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(this.apiUrlSesiones,{ headers });
  }

  obtenerTUsuarios(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(this.apiUrlTiposUsuarios, { headers });
  }
}

