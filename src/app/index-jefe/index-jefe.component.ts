import { Component, OnInit } from '@angular/core';
import { ObtenerService } from './../service/obtener.service';
import { EditarService } from './../service/editar.service';
import { EliminarService } from './../service/eliminar.service';
import { RegistroService } from '../service/registro.service';
import { RegistrosService } from '../service/registrou.service';
import { CommonModule } from '@angular/common'; // 👈 IMPORTA CommonModule
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-index-jefe',
  templateUrl: './index-jefe.component.html',
  styleUrl: './index-jefe.component.css'
})
export class IndexJefeComponent implements OnInit {
  Tusuarios: any[] = [];
  usuarios: any[] = [];
  sesiones: any[] = [];
  usuariosCombinados: any[] = [];
  selectedUsuario: any = null;
  usuarioEditado: any = {};
  username: any = {};
  usuario = {
    id_tipo_persona: 0,
    nombre: '',
    apellido_pat: '',
    apellido_mat: '',
    curp: '',
    rfc: '',
    sexo: 2,
    fecha_nac: '',
    activo: 2
  };
  sesion = {
    id_login: 0,
    id_persona: 0,
    username: '',
    password: ''
  };
  error: string = '';

  constructor(
    private obtenerService: ObtenerService,
    private editarService: EditarService,
    private eliminarService: EliminarService,
    private registroService: RegistroService,
    private registrotps: RegistrosService
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.obtenerTUsuarios();
    this.obtenerSesiones();
  }


  obtenerUsuarios(): void {
    this.obtenerService.obtenerUsuarios().subscribe(
      (data) => {
        this.usuarios = data;
        this.combinarUsuariosYSesiones();  // Llamamos a la función para combinar
        console.log('Usuarios obtenidos:', this.usuarios);
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  obtenerSesiones(): void {
    this.obtenerService.obtenerSesiones().subscribe(
      (data) => {
        this.sesiones = data;
        this.combinarUsuariosYSesiones();  // Llamamos a la función para combinar
        console.log('Sesiones obtenidos:', this.sesiones);
      },
      (error) => {
        console.error('Error al obtener sesiones:', error);
      }
    );
  }

  opensesionDialog(usuario: any): void {
    this.selectedUsuario = { ...usuario };
    this.username = { ...usuario };
    this.username.id = usuario.id_personas;
    this.username.alias = usuario.alias;

    // Muestra el modal
    (document.getElementById('modal5') as HTMLDialogElement).showModal();
    console.log("Usuario a editar:", this.username.id);
    console.log("Usuario a editar:", this.username);
  }

  closesesionFormDialog(): void {
    // Cierra el modal
    (document.getElementById('modal5') as HTMLDialogElement).close();
  }

  eorsesion(): void {
    // Verifica si existe un usuario seleccionado
    if (!this.selectedUsuario) return;

    // Si no hay alias (sesión no iniciada), proceder con el registro
    if (!this.username.alias) {
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

      // Prepara los datos para el registro
      const data = {
        id_persona: this.selectedUsuario.id_personas,  // Usamos el id_persona del token
        username: this.username.username,
        password: this.username.password // Asegúrate de usar 'password' correctamente
      };

      console.log("⚡ Enviando datos de registro:", data);

      // Llama al servicio para registrar el usuario
      this.registrotps.registrarUser(data).subscribe(
        (response: any) => {
          console.log('✅ Persona registrada:', response);
          this.obtenerTUsuarios();
          this.obtenerUsuarios();
          this.closesesionFormDialog()
        },
        (error: any) => {
          console.error('❌ Error al registrar:', error);
          this.error = 'Hubo un problema al registrar. Inténtalo de nuevo.';
        }
      );
    } else {
      // Si hay un alias (sesión iniciada), proceder con la edición del usuario

      this.username.id = this.selectedUsuario.id_personas;
      console.log("Usuario a editar:", this.username);

      // Verifica si todos los campos de usuarioEditado están completos
      for (const key in this.username) {
        if (this.username[key] === '' || this.username[key] === null) {
          console.error(`Error: El campo ${key} está vacío.`);
          this.error = `El campo ${key} está vacío, por favor complete todos los campos.`;
          return;
        }
      }

      // Compara los datos actuales con los datos editados
      const cambios = Object.keys(this.username).some(
        (key) => this.username[key] !== this.selectedUsuario[key]
      );

      // Si no hay cambios, no hacer nada
      if (!cambios) {
        console.log('No hay cambios en los datos, no se actualiza.');
        this.closesesionFormDialog()
        return;
      }
      console.log('Usuarios',cambios );

      // Llama al servicio para editar el usuario
      this.editarService.editarUser(this.username).subscribe(
        (response: any) => {
          console.log('Usuario editado correctamente', response);
          this.obtenerTUsuarios();
          this.obtenerUsuarios();
          this.closesesionFormDialog()
        },
        (error: any) => {
          console.error('❌ Error al editar usuario', error);
          this.error = 'Hubo un problema al editar el usuario. Inténtalo de nuevo.';

        }
      );
    }
  }


  combinarUsuariosYSesiones(): void {
    // Verificamos que ambas listas no estén vacías
    if (this.usuarios.length > 0 && this.sesiones.length > 0) {
      this.usuariosCombinados = this.usuarios.map((usuario) => {
        // Buscamos la sesión correspondiente al usuario por id_persona
        const sesion = this.sesiones.find(s => s.id_persona === usuario.id_persona);

        // Si encontramos una sesión, la combinamos con el usuario
        if (sesion) {
          return { ...usuario, sesion: sesion };
        }
        // Si no se encuentra sesión, devolvemos solo el usuario
        return { ...usuario, sesion: null };
      });

      console.log('Usuarios combinados:', this.usuariosCombinados);
    } else {
      console.warn('Las listas de usuarios o sesiones están vacías');
    }
  }


  toggleActivo(usuario: any): void {
    // Mostrar el estado previo de 'activo' en consola
    console.log(`Estado previo de ${usuario.nombre}: ${usuario.activo === 1 ? 'Activo' : 'Inactivo'}`);

    // Validar que el valor de 'activo' sea el esperado (0 o 1)
    // Si el valor está en 1 (activo), el checkbox estará marcado
    // Si el valor está en 0 (inactivo), el checkbox estará desmarcado

    // Crear el objeto con los datos para enviar al backend
    const usuarioActivos = {
      id: usuario.id_personas,  // Se pasa el ID del usuario
      activo: usuario.activo  // Se pasa el nuevo estado (activo = 1 o inactivo = 0)
    };

    console.log('Datos obtenidos para actualizar estado:', usuarioActivos);  // Verificación en consola

    // Llamada al servicio para actualizar el estado en la base de datos
    this.editarService.editarUsuario(usuarioActivos).subscribe(
      (response: any) => {
        // Mensaje en consola si la actualización es exitosa
        console.log(`Estado de usuario ${usuario.nombre} actualizado a ${usuario.activo === 1 ? 'Activo' : 'Inactivo'}`);

        // Después de la respuesta exitosa, se actualiza la lista de usuarios
        this.obtenerUsuarios();
      },
      (error: any) => {
        console.error('Error al actualizar el estado de activo:', error);
        // Si ocurre un error, revertimos el cambio de estado (esto es solo por seguridad)
        usuario.activo = usuario.activo === 1 ? 0 : 1;
      }
    );
  }


  openRegisterDialog(): void {
    this.usuario = {
      id_tipo_persona: 3,
      nombre: '',
      apellido_pat: '',
      apellido_mat: '',
      curp: '',
      rfc: '',
      sexo: 0,
      fecha_nac: '',
      activo: 1
    };

    (document.getElementById('modal4') as HTMLDialogElement).showModal();
  }
  closeRegisterFormDialog(): void {
    (document.getElementById('modal4') as HTMLDialogElement).close();
  }

  registrarUsuario() {
    // Log: Datos del usuario antes de enviarlos al backend
    console.log('Datos a enviar para registrar usuario:', this.usuario);

    // Convertir el tipo de persona a número
    this.usuario.id_tipo_persona = Number(this.usuario.id_tipo_persona);

    // Validar que el tipo de usuario esté definido
    if (this.usuario.id_tipo_persona === undefined || this.usuario.id_tipo_persona === null) {
      alert('El tipo de usuario es obligatorio.');
      return;
    }

    // Llamar al servicio para registrar el usuario
    this.registroService.registrarUsuario(this.usuario).subscribe(
      (response: any) => {
        // Log: Cuando el registro es exitoso
        console.log('Usuario registrado exitosamente:', response);
        this.closeRegisterFormDialog();  // Cerrar el formulario
        this.obtenerUsuarios();  // Obtener la lista de usuarios actualizada
      },
      (error: any) => {
        // Log: Si ocurre un error
        console.error('Error al registrar el usuario:', error);
        alert('Error al registrar el usuario');
      }
    );
  }


  obtenerTUsuarios(): void {
    this.obtenerService.obtenerTUsuarios().subscribe(
      (data: any) => {
        console.log('Datos recibidos:', data);

        if (Array.isArray(data)) {
          this.Tusuarios = data.map((row: any) => ({
            id_tipo_persona: row.id_tipo_persona,
            nombre: row.nombre
          }));
        } else {
          console.error('La estructura de los datos no es válida:', data);
        }

        console.log('Tipos de Usuarios obtenidos:', this.Tusuarios);
      },
      (error) => {
        console.error('Error al obtener Tipos de usuarios:', error);
      }
    );
  }

  openEditDialog(usuario: any): void {
    this.selectedUsuario = { ...usuario };
    this.usuarioEditado = { ...usuario };
    this.usuarioEditado.id = usuario.id_personas;

    (document.getElementById('modal3') as HTMLDialogElement).showModal();
  }

  closeEditFormDialog(): void {
    (document.getElementById('modal3') as HTMLDialogElement).close();
  }

  editarUsuario(): void {
    if (!this.selectedUsuario) return;

    this.usuarioEditado.id = this.selectedUsuario.id_personas;
    console.log("Usuario a editar:", this.usuarioEditado);

    for (const key in this.usuarioEditado) {
      if (this.usuarioEditado[key] === '' || this.usuarioEditado[key] === null) {
        console.error(`Error: El campo ${key} está vacío.`);
        return;
      }
    }

    const cambios = Object.keys(this.usuarioEditado).some(
      (key) => this.usuarioEditado[key] !== this.selectedUsuario[key]
    );

    if (!cambios) {
      console.log('No hay cambios en los datos, no se actualiza.');
      this.closeEditFormDialog();
      return;
    }

    this.editarService.editarUsuario(this.usuarioEditado).subscribe(
      (response: any) => {
        console.log('Usuario editado correctamente', response);
        console.log(this.usuarioEditado)
        this.obtenerTUsuarios();
        this.obtenerUsuarios();
        this.closeEditFormDialog();
      },
      (error: any) => {
        console.error('Error al editar usuario', error);
      }
    );
  }

  openDeleteDialog(usuarioId: number): void {
    this.selectedUsuario = this.usuarios.find(usuario => usuario.id_personas === usuarioId);

    if (this.selectedUsuario) {
      console.log('Usuario seleccionado para eliminar:', this.selectedUsuario);

      const modal = document.getElementById('modal2') as HTMLDialogElement;
      modal.showModal();
    } else {
      console.error('No se encontró el usuario con ID:', usuarioId);
    }
  }

  closeDeleteDialog(): void {
    const modal = document.getElementById('modal2') as HTMLDialogElement;
    if (modal) {
      modal.close();
    } else {
      console.error('No se pudo encontrar el modal para cerrarlo.');
    }
  }

  deleteUser(): void {
    if (this.selectedUsuario) {
      const idUsuario = this.selectedUsuario.id_personas;
      console.log('Eliminando usuario con ID:', idUsuario);

      this.eliminarService.eliminarUsuario(idUsuario).subscribe(
        (response: any) => {
          console.log('Usuario eliminado correctamente', response);
          this.obtenerUsuarios();
          this.closeDeleteDialog();
        },
        (error: any) => {
          console.error('Error al eliminar usuario', error);
        }
      );
    } else {
      console.error('No se ha seleccionado un usuario para eliminar.');
    }
  }

}
