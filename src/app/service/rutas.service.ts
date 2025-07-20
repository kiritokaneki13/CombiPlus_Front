import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RutasService {
  private apiUrl = 'https://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Crear una nueva ruta
  registrarRuta(ruta: { nombre: string; coordenadas: any[] }): Observable<any> {
    return this.http.post(`${this.apiUrl}/crutas`, ruta);
  }

    // Obtener todas las rutas
    obtenerRutas(): Observable<any> {
      return this.http.get(`${this.apiUrl}/rrutas`);
    }

  // Editar una ruta
  editarRuta(id: number, ruta: { nombre: string; coordenadas: any[] }): Observable<any> {
    return this.http.put(`${this.apiUrl}/urutas/${id}`, ruta);
  }

  // Eliminar una ruta
  eliminarRuta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/drutas/${id}`);
  }

  // Registrar una nueva parada
  registrarParada(parada: { nombre: string; latitud: number; longitud: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/cparadas`, parada);
  }
  // Obtener todas las paradas
  obtenerParadas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rparadas`);
  }
  // Editar una parada
  editarParada(id: number, parada: { nombre: string; latitud: number; longitud: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/uparadas/${id}`, parada);
  }

  // Eliminar una parada
  eliminarParada(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/dparadas/${id}`);
  }
}
