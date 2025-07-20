import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class Registro_TPService {
  private apiUrl = 'https://localhost:3000/api'; // URL de tu API

  constructor(private http: HttpClient, private router: Router) {}

  registrarPersona(data: any) {

    const token = localStorage.getItem('userToken'); // Aquí corriges el nombre, perfecto

    if (!token) {
      throw new Error('Token no encontrado.');
    }

    // Decodificar el token para obtener el id_persona (si lo quieres usar)
    const decodedToken: any = jwtDecode(token);
    const id_persona = decodedToken.id_persona;

    // Si quieres, agrégalo a los datos
    data.id_persona = id_persona;

    // Crear headers con el token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Mandar la petición PUT con headers
    return this.http.put(`${this.apiUrl}/Registropersonasp2`, data, { headers }).pipe(
      catchError((error) => {
        console.error('❌ Error en la solicitud:', error);
        return throwError(() => error);
      })
    );
  }
}
