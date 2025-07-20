import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { Registro_TPService } from '../service/registrotp.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; //
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-registro-tipop',
  templateUrl: './registro-tipop.component.html',
  styleUrls: ['./registro-tipop.component.css']
})
export class RegistroTipopComponent {
  tusuarioRegistro: any = {};
  error: string = '';

  constructor(
    private registrotps: Registro_TPService,
    private router: Router
  ) {}

  registarUsuario() {
    // Verifica si se seleccionó un tipo de usuario
    if (!this.tusuarioRegistro?.id_tipo_persona) {
      this.error = 'Todos los campos son obligatorios, wey.';
      console.error("❌ Faltan datos:", this.tusuarioRegistro);
      return;
    }

    // Asegurarnos de que tusuarioRegistro tenga el tipo de usuario
    if (this.tusuarioRegistro.id_tipo_persona !== 2 && this.tusuarioRegistro.id_tipo_persona !== 4) {
      console.error('❌ Tipo de usuario no válido.');
      this.error = 'Hubo un problema con la selección del tipo de usuario. Inténtalo de nuevo.';
      return;
    }

    // Recuperamos el token del localStorage
    const token = localStorage.getItem('userToken');
    if (!token) {
      console.error('❌ Token no encontrado');
      this.error = 'No se encontró un token válido. Inicia sesión nuevamente.';
      return;
    }

    // Decodificamos el token para obtener el id_persona
    let decodedToken: any;
    try {
      decodedToken = this.decodeToken(token);
    } catch (error) {
      console.error('❌ Error al decodificar el token:', error);
      this.error = 'Error al decodificar el token. Inténtalo de nuevo.';
      return;
    }

    // Verificamos que el token contiene el id_persona
    const id_persona = decodedToken?.id_persona;
    if (!id_persona) {
      console.error('❌ El token no contiene id_persona');
      this.error = 'El token no contiene un id_persona válido.';
      return;
    }

    // Llenar tusuarioRegistro con id_persona y id_tipo_persona
    const data = {
      id_persona: id_persona,          // El id que recuperamos del token
      id_tipo_persona: this.tusuarioRegistro.id_tipo_persona, // El tipo de usuario seleccionado
      activo: 1
    };

    console.log("⚡ Enviando datos de registro:", data);

    // Usamos el servicio para enviar la solicitud
    this.registrotps.registrarPersona(data).subscribe({
      next: (response: any) => {
        console.log('✅ Persona registrada:', response);

        // Si la persona se registró correctamente, redirige
        this.router.navigate(['/registrou']);  // Redirige sin necesidad de enviar idPersona
      },
      error: (error: any) => {
        console.error('❌ Error al registrar:', error);
        this.error = 'Hubo un problema al registrar. Inténtalo de nuevo.';
      }
    });
  }

  // Función para decodificar el token
  private decodeToken(token: string): any {
    const payload = token.split('.')[1]; // El payload es la segunda parte del token
    const decodedPayload = atob(payload); // Decodificamos la parte en base64
    return JSON.parse(decodedPayload); // Lo convertimos a objeto
  }
  regresarAlrn() {
    console.log("↩️ Regresando al login...");
    this.router.navigate(['/registrop1']);
  }

}
