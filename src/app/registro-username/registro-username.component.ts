import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegistrosService } from '../service/registrou.service';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // 👈 IMPORTA CommonModule
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-registro-username',
  templateUrl: './registro-username.component.html',
  styleUrls: ['./registro-username.component.css']
})
export class RegistroUsernameComponent {
  username: any = {}; // Contendrá username, password y conpassword
  error: string = '';
  idPersona: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private registrotps: RegistrosService,
    private router: Router
  ) {}

  ngOnInit() {
    // Intentar obtener el token del localStorage
    const token = localStorage.getItem('userToken');
    if (!token) {
      this.error = 'No se encontró un token válido. Inicia sesión nuevamente.';
      return;
    }

    // Decodificamos el token para obtener el id_persona
    let decodedToken: any;
    try {
      decodedToken = this.decodeToken(token);
      this.idPersona = decodedToken?.id_persona; // Asignamos id_persona desde el token
    } catch (error) {
      console.error('❌ Error al decodificar el token:', error);
      this.error = 'Error al decodificar el token. Inténtalo de nuevo.';
      return;
    }

    // Verificamos que el id_persona exista
    if (!this.idPersona) {
      this.error = 'El token no contiene id_persona válido.';
      return;
    }

    console.log('ID persona recibida desde el token:', this.idPersona);
  }

  registarUsuario() {
    // Verificar si el campo de usuario, contraseña y confirmar contraseña están presentes
    if (!this.username.username || !this.username.password || !this.username.conpassword) {
      this.error = 'Todos los campos son obligatorios, wey.';
      console.error("❌ Faltan datos:", this.username);
      return;
    }

    // Verifica que la contraseña tenga al menos 8 caracteres
    if (this.username.password.length < 8) {
      this.error = 'La contraseña debe tener al menos 8 caracteres.';
      console.error("❌ Contraseña demasiado corta");
      return;
    }

    // Verifica que las contraseñas coincidan
    if (this.username.password !== this.username.conpassword) {
      this.error = 'Las contraseñas no coinciden, cabrón.';
      console.error("❌ Las contraseñas no coinciden");
      return;
    }

    const data = {
      id_persona: this.idPersona,  // Usamos el id_persona del token
      username: this.username.username,
      password: this.username.password // Asegúrate de usar 'password' correctamente
    };

    console.log("⚡ Enviando datos de registro:", data);

    this.registrotps.registrarUser(data).subscribe(
      (response: any) => {
        console.log('✅ Persona registrada:', response);
        this.router.navigate(['/login']);  // Redirige con idPersona
      },
      (error: any) => {
        console.error('❌ Error al registrar:', error);
        this.error = 'Hubo un problema al registrar. Inténtalo de nuevo.';
      }
    );
  }

  // Función para decodificar el token
  private decodeToken(token: string): any {
    const payload = token.split('.')[1]; // El payload es la segunda parte del token
    const decodedPayload = atob(payload); // Decodificamos la parte en base64
    return JSON.parse(decodedPayload); // Lo convertimos a objeto
  }

  regresarAlrt() {
    console.log("↩️ Regresando al login...");
    this.router.navigate(['/login']);
  }

}
