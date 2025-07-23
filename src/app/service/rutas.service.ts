import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RutasService {
  private apiUrl = 'https://localhost:3000/api';

  constructor(private http: HttpClient) {}

  registrarRuta(ruta: { nombre: string; coordenadas: any[] }): Observable<any> {
    return this.http.post(`${this.apiUrl}/crutas`, ruta);
  }

    obtenerRutas(): Observable<any> {
      return this.http.get(`${this.apiUrl}/rrutas`);
    }

  editarRuta(id: number, ruta: { nombre: string; coordenadas: any[] }): Observable<any> {
    return this.http.put(`${this.apiUrl}/urutas/${id}`, ruta);
  }

  eliminarRuta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/drutas/${id}`);
  }
  registrarParada(parada: { nombre: string; latitud: number; longitud: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/cparadas`, parada);
  }

  obtenerParadas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rparadas`);
  }

  editarParada(id: number, parada: { nombre: string; latitud: number; longitud: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/uparadas/${id}`, parada);
  }

  eliminarParada(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/dparadas/${id}`);
  }
}
