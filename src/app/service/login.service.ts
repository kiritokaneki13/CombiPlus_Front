import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:3000/api/login';  // Asegúrate de que esta URL es correcta

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    // Definir el cuerpo de la solicitud
    const body = { username, password };

    // Definir los headers necesarios (si es necesario, agregar más)
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    // Realizar la solicitud POST
    return this.http.post(this.apiUrl, body, { headers });
  }
}
