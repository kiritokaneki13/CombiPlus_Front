import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Registro_NameService {
  private apiUrl = 'http://localhost:3000/api/Registropersonasp1';

  constructor(private http: HttpClient) {}

  registrarPersona(persona: any): Observable<any> {
    console.log('📤 Enviando datos de registro:', persona);
    return this.http.post(this.apiUrl, persona).pipe(
      catchError((error) => {
        console.error('Error al registrar persona:', error);
        return throwError(() => new Error('No se pudo conectar con el servidor o hubo un error en el registro'));
      })
    );
  }
}