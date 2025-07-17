import { Component } from '@angular/core';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // 👈 IMPORTA CommonModule
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private loginservice: LoginService, private router: Router) {}

  login() {
    console.log("⚡ Intentando login con los siguientes datos:", { username: this.username, password: this.password });

    if (!this.username || !this.password) {
      this.error = 'Llena todos los campos, wey.';
      console.log("❌ Error: Faltan campos", this.error);
      return;
    }

    // Realizamos la llamada al servicio para hacer login
    console.log("🔍 Llamando al servicio para validar credenciales...");

    this.loginservice.login(this.username, this.password).subscribe(
      (response) => {
        console.log("✅ Respuesta recibida del backend:", response);

        if (response && response.user && response.user.id_tipo_persona) {
          if (response.user.activo === false) {
            this.error = 'Usuario Inactivo.';
            console.log("❌ Error: Usuario inactivo", this.error);
            return;
          }

          if (response.user.id_tipo_persona === 3) {
            console.log("🔴 Redirigiendo a la página de chofer...");
            this.router.navigate(['/mapa']);
          } else if (response.user.id_tipo_persona === 2) {
            console.log("🔴 Redirigiendo a la página de patrón...");
            this.router.navigate(['/indexj']);
          } else if (response.user.id_tipo_persona === 1) {
            console.log("🔴 Redirigiendo a la página del admin...");
            this.router.navigate(['/index']);
          } else if (response.user.id_tipo_persona === 4) {
            console.log("🔴 Redirigiendo a la página del user...");
            this.router.navigate(['/mapa']);
          } else {
            this.error = 'No eres chofer ni patrón, o las credenciales están mal.';
            console.log("❌ Error: Usuario no autorizado o credenciales incorrectas");
          }
        } else {
          this.error = 'No se pudo obtener el tipo de usuario. Verifica los datos.';
        }
      },
      (err) => {
        this.error = 'Usuario o contraseña incorrectos.';
        console.error("❌ Error en la solicitud de login:", err);
      }
    );
  }

  irARegistro() {
    console.log("➡️ Redirigiendo a la página de registro...");
    this.router.navigate(['/registrop1']);
  }


}
