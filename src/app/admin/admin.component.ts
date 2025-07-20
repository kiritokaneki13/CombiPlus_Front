import { Component, OnInit } from '@angular/core';
import { ObtenerService } from './../service/obtener.service';
import { EditarService } from './../service/editar.service';
import { EliminarService } from './../service/eliminar.service';
import { RegistroService } from '../service/registro.service';
import { CommonModule } from '@angular/common'; // 👈 IMPORTA CommonModule
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule], // 👈 AÑADE CommonModule AQUÍ
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  Tusuarios: any[] = [];
  usuarios: any[] = [];
  selectedUsuario: any = null;
  usuarioEditado: any = {};
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

  constructor(
    private obtenerService: ObtenerService,
    private editarService: EditarService,
    private eliminarService: EliminarService,
    private registroService: RegistroService
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.obtenerTUsuarios();
  }


  obtenerUsuarios(): void {
    this.obtenerService.obtenerUsuarios().subscribe(
      (data) => {
        this.usuarios = data;
        console.log('Usuarios obtenidos:', this.usuarios);
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  openRegisterDialog(): void {
    this.usuario = {
      id_tipo_persona: 0,
      nombre: '',
      apellido_pat: '',
      apellido_mat: '',
      curp: '',
      rfc: '',
      sexo: 0,
      fecha_nac: '',
      activo: 0
    };

    (document.getElementById('modal4') as HTMLDialogElement).showModal();
  }
  closeRegisterFormDialog(): void {
    (document.getElementById('modal4') as HTMLDialogElement).close();
  }

  registrarUsuario() {
    this.usuario.id_tipo_persona = Number(this.usuario.id_tipo_persona);

    if (this.usuario.id_tipo_persona === undefined || this.usuario.id_tipo_persona === null) {
      alert('El tipo de usuario es obligatorio.');
      return;
    }

    this.registroService.registrarUsuario(this.usuario).subscribe(
      (response: any) => {
        console.log('Usuario registrado:', response);
        this.closeRegisterFormDialog();
        this.obtenerUsuarios();
      },
      (error: any) => {
        console.error('Error al registrar:', error);
        console.log(this.usuario);
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
