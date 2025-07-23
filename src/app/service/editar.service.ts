  import { Injectable } from '@angular/core';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { Observable, throwError } from 'rxjs';
  import { catchError } from 'rxjs/operators';

  @Injectable({
    providedIn: 'root'
  })
  export class EditarService {
    private apiUrl = 'https://localhost:3000/api/usuarios';
    private apiUrlE = 'https://localhost:3000/api/EditarUsername';

    constructor(private http: HttpClient) {}

    editarUsuario(usuario: any): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      if (!usuario?.id) {
        console.error('Error: No se proporcionó un ID válido para la edición.');
        return throwError(() => new Error('El usuario debe tener un ID válido.'));
      }
      return this.http.put(`${this.apiUrl}/${usuario.id}`, usuario, { headers }).pipe(
        catchError(error => {
          console.error('Error al editar usuario:', error);
          return throwError(() => new Error('Error al editar usuario.'));
        })
      );
    }
    editarUser(usuario: any): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      if (!usuario?.id) {
        console.error('Error: No se proporcionó un ID válido para la edición.');
        return throwError(() => new Error('El usuario debe tener un ID válido.'));
      }
      return this.http.put(`${this.apiUrlE}/${usuario.id}`, usuario, { headers }).pipe(
        catchError(error => {
          console.error('Error al editar usuario:', error);
          return throwError(() => new Error('Error al editar usuario.'));
        })
      );
    }
  }
