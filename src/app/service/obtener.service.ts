import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http.get(this.apiUrlUsuarios);
  }

  obtenerSesiones(): Observable<any> {
    return this.http.get(this.apiUrlSesiones);
  }

  obtenerTUsuarios(): Observable<any> {
    return this.http.get(this.apiUrlTiposUsuarios);
  }
}

