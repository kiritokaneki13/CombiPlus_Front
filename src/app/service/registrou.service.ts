import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrosService {
  private apiUrl = 'https://localhost:3000/api/registros';

  constructor(private http: HttpClient) {}

  registrarUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user, { headers: { 'Content-Type': 'application/json' } });
  }
}
