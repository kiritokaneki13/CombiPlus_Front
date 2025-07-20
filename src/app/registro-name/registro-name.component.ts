import { Component } from '@angular/core';
import { Registro_NameService } from '../service/registro_name.service';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode'; // Importar jwt-decode
import { CommonModule } from '@angular/common'; // 👈 IMPORTA CommonModule
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-registro-name',
  templateUrl: './registro-name.component.html',
  styleUrls: ['./registro-name.component.css']
})
export class RegistroNameComponent {
  persona = {
    nombre: '',
    apellido_pat: '',
    apellido_mat: '',
    sexo:3// Cambiamos a null para que no haya valor por defecto inválido
  };

  error: string = '';

  constructor(private registroService: Registro_NameService, private router: Router) {}

  registrarUsuario() {
    // Verificar que todos los campos sean completados
    if (!this.persona.nombre || !this.persona.apellido_pat || !this.persona.apellido_mat || !this.persona.sexo) {
      this.error = 'Todos los campos son obligatorios, wey.';
      console.error("❌ Faltan datos:", this.persona);
      return;
    }


    console.log("⚡ Enviando datos de registro:", this.persona);

  this.registroService.registrarPersona(this.persona).subscribe(
    (response: any) => {
      console.log('✅ Persona registrada:', response);

      // Guardar el token JWT que contiene el id_personas
      const token = response.token;  // Aquí sí es el JWT
      localStorage.setItem('userToken', token);


      const decodedToken: any = jwtDecode(token);
        console.log('🔍 Token decodificado:', decodedToken);
        const idPersonaFromToken = decodedToken.id_persona;
        console.log('🆔 ID de persona en el token:', idPersonaFromToken);

      // Opcional: guardar el id_persona por separado si lo necesitas
      const idPersona = response.id_persona;
      localStorage.setItem('idPersona', idPersona);

      this.router.navigate(['/registrotp']);
    },
    (error: any) => {
      console.error('❌ Error al registrar:', error);
      this.error = error.error?.message || 'Hubo un problema al registrar. Inténtalo de nuevo.';
    }
  );
}
regresarAlLogin() {
  console.log("↩️ Regresando al login...");
  this.router.navigate(['/login']);
}

}
