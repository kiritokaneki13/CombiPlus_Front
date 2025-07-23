import { Component, OnInit } from '@angular/core';
import { ObtenerService } from './../service/obtener.service';
import { EditarService } from './../service/editar.service';
import { EliminarService } from './../service/eliminar.service';
import { RegistroService } from '../service/registro.service';
import { RutasService } from './../service/rutas.service';
import { RegistrosService } from '../service/registrou.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // 👈 IMPORTA CommonModule
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

declare module 'leaflet' {
  namespace Control {
    class Draw extends Control {
      constructor(options?: Draw.DrawConstructorOptions)
    }
  }
  namespace Draw {
    interface DrawConstructorOptions {
      edit?: EditOptions;
      draw?: DrawOptions;
    }
    interface EditOptions {
      featureGroup: FeatureGroup;
      remove?: boolean;
    }
    interface DrawOptions {
      polyline?: any;
      polygon?: any;
      rectangle?: any;
      circle?: any;
      marker?: any;
      circlemarker?: any;
    }
    namespace Event {
      const CREATED: string;
    }
  }
}

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  Tusuarios: any[] = [];
  usuarios: any[] = [];
  usuariosCombinados: any[] = [];
  sesiones: any[] = [];
  username: any = {};
  error: string = '';
  selectedUsuario: any = null;
  usuarioEditado: any = {};
  nuevaParada = {
    nombre: '',
    latitud: 0,
    longitud: 0
  };
  errorMessage: string = '';
  usuario = {
    id_tipo_persona: 0,
    nombre: '',
    apellido_pat: '',
    apellido_mat: '',
    curp: '',
    rfc: '',
    sexo: 2,
    fecha_nac: '',
    activo: 2,
  };
  rutaNombre: string = '';
  map!: L.Map;
  mapRoute!: L.Map;
  drawnItems!: L.FeatureGroup;
  marker!: L.Marker;

  constructor(
    private obtenerService: ObtenerService,
    private editarService: EditarService,
    private eliminarService: EliminarService,
    private registroService: RegistroService,
    private rutasService: RutasService,
    private router: Router,
    private registrotps: RegistrosService
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.obtenerTUsuarios();
    this.initRouteMap();
  }

  goToMap() {
    this.router.navigate(['/mapa-admin']);
  }
  Finish() {
    localStorage.removeItem('token');
    this.router.navigate(['']);
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
         if (error.status === 404) {
          this.errorMessage = 'El usuario no fue encontrado para eliminar.';
        } else {
          this.errorMessage = 'No se ha Iniciado Sesion.';
        }
      }
    );
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

    (document.getElementById('modal4') as HTMLDialogElement)?.showModal();
  }

  closeRegisterFormDialog(): void {
    (document.getElementById('modal4') as HTMLDialogElement)?.close();
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
        if (error.status === 404) {
          this.errorMessage = 'El usuario no fue encontrado para eliminar.';
        } else {
          this.errorMessage = 'No se ha Iniciado Sesion.';
        }
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
        if (error.status === 404) {
          this.errorMessage = 'El usuario no fue encontrado para eliminar.';
        } else {
          this.errorMessage = 'No se ha Iniciado Sesion.';
        }
      }
    );
  }

  openEditDialog(usuario: any): void {
    this.selectedUsuario = { ...usuario };
    this.usuarioEditado = { ...usuario };
    this.usuarioEditado.id = usuario.id_personas;

    (document.getElementById('modal3') as HTMLDialogElement)?.showModal();
  }

  closeEditFormDialog(): void {
    (document.getElementById('modal3') as HTMLDialogElement)?.close();
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
        this.obtenerTUsuarios();
        this.obtenerUsuarios();
        this.closeEditFormDialog();
      },
      (error: any) => {
        console.error('Error al editar usuario', error);
        if (error.status === 404) {
          this.errorMessage = 'El usuario no fue encontrado para eliminar.';
        } else {
          this.errorMessage = 'No se ha Iniciado Sesion.';
        }
      }
    );
  }

  openDeleteDialog(usuarioId: number): void {
    this.selectedUsuario = this.usuarios.find(usuario => usuario.id_personas === usuarioId);

    if (this.selectedUsuario) {
      console.log('Usuario seleccionado para eliminar:', this.selectedUsuario);

      const modal = document.getElementById('modal2') as HTMLDialogElement;
      modal?.showModal();
    } else {
      console.error('No se encontró el usuario con ID:', usuarioId);
    }
  }

  closeDeleteDialog(): void {
    const modal = document.getElementById('modal2') as HTMLDialogElement;
    modal?.close();
  }

  deleteUser(): void {
  if (this.selectedUsuario) {
    const idUsuario = this.selectedUsuario.id_personas;
    console.log('Eliminando usuario con ID:', idUsuario);

    this.eliminarService.eliminarUsuario(idUsuario).subscribe(
      (response: any) => {
        console.log('Usuario eliminado correctamente', response);
        this.errorMessage = '';
        this.obtenerUsuarios();
        this.closeDeleteDialog();
      },
      (error: any) => {
        console.error('Error al eliminar usuario', error);
        if (error.status === 404) {
          this.errorMessage = 'El usuario no fue encontrado para eliminar.';
        } else {
          this.errorMessage = 'Ocurrió un error al eliminar el usuario.';
        }
      }
    );
  } else {
    console.error('No se ha seleccionado un usuario para eliminar.');
    this.errorMessage = 'Debes seleccionar un usuario para eliminar.';
  }
}

openMapDialog(): void {
  const modal = document.getElementById('modalMap') as HTMLDialogElement | null;
  if (modal) {
    modal.showModal();
    this.initMap();
  } else {
    console.error('No se encontró el modal del mapa.');
  }
}

initMap(): void {
  this.map = L.map('map').setView([17.9869, -92.9303], 12);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  }).addTo(this.map);

  this.map.on('click', (e: any) => {
    const { lat, lng } = e.latlng;

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }

    this.nuevaParada.latitud = lat;
    this.nuevaParada.longitud = lng;
    console.log('Parada ubicada en:', this.nuevaParada);
  });
}

addStop(): void {
  if (!this.nuevaParada.nombre) {
    alert('Por favor, ingresa el nombre de la parada.');
    return;
  }
  console.log('Parada agregada temporalmente:', this.nuevaParada);
}

saveStop(): void {
  if (!this.nuevaParada.nombre || !this.nuevaParada.latitud || !this.nuevaParada.longitud) {
    alert('Debes ingresar un nombre y seleccionar una ubicación en el mapa.');
    return;
  }

  this.rutasService.registrarParada(this.nuevaParada).subscribe(
    (response) => {
      console.log('Parada guardada:', response);
      alert('Parada guardada correctamente');
      this.nuevaParada = { nombre: '', latitud: 0, longitud: 0 };
    },
    (error) => {
      console.error('Error al guardar parada:', error);
      alert('Error al guardar la parada.');
      if (error.status === 404) {
          this.errorMessage = 'El usuario no fue encontrado para eliminar.';
        } else {
          this.errorMessage = 'No se ha Iniciado Sesion.';
        }
    }
  );
}

closeMapDialog(): void {
  (document.getElementById('modalMap') as HTMLDialogElement).close();
}

initRouteMap(): void {
  setTimeout(() => {
    if (!document.getElementById('mapRoute')) {
      console.error('Map container not found');
      return;
    }

    this.mapRoute = L.map('mapRoute', {
      center: [17.9869, -92.9303],
      zoom: 12
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.mapRoute);

    this.drawnItems = new L.FeatureGroup();
    this.mapRoute.addLayer(this.drawnItems);

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: this.drawnItems,
        remove: true
      },
      draw: {
        polyline: true,
        polygon: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false
      }
    });
    this.mapRoute.addControl(drawControl);

    this.mapRoute.invalidateSize();

    this.mapRoute.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;
      this.drawnItems.addLayer(layer);
    });
  }, 100);
}

// 🛣️ Abrir modal de Rutas
openRouteDialog(): void {
  (document.getElementById('routeDialog') as HTMLDialogElement).showModal();
  setTimeout(() => {
    if (this.mapRoute) {
      this.mapRoute.invalidateSize();
    }
  }, 100);
}

// 🛣️ Cerrar modal de Rutas
closeRouteDialog(): void {
  (document.getElementById('routeDialog') as HTMLDialogElement).close();
}

// 🛣️ Guardar Ruta en el backend
saveRoute(): void {
  if (!this.rutaNombre) {
    alert('Por favor ingresa un nombre para la ruta.');
    return;
  }

  const coordenadas: any[] = [];
  this.drawnItems.eachLayer((layer: any) => {
    if (layer instanceof L.Polyline) {
      coordenadas.push(layer.getLatLngs().map((latlng: any) => ({ lat: latlng.lat, lng: latlng.lng })));
    }
  });

  if (coordenadas.length === 0) {
    alert('Debes dibujar una ruta antes de guardarla.');
    return;
  }

  const nuevaRuta = { nombre: this.rutaNombre, coordenadas };

  this.rutasService.registrarRuta(nuevaRuta).subscribe(
    (response) => {
      console.log('Ruta guardada:', response);
      alert('Ruta guardada correctamente');
      this.rutaNombre = '';
      this.drawnItems.clearLayers();
    },
    (error) => {
      console.error('Error al guardar ruta:', error);
      alert('Error al guardar la ruta.');
      if (error.status === 404) {
          this.errorMessage = 'El usuario no fue encontrado para eliminar.';
        } else {
          this.errorMessage = 'No se ha Iniciado Sesion.';
        }
    }
  );
}

clearRoute(): void {
  this.drawnItems.clearLayers();
  alert('Ruta borrada');
}

toggleActivo(usuario: any): void {
  console.log(`Estado previo de ${usuario.nombre}: ${usuario.activo === 1 ? 'Activo' : 'Inactivo'}`);

  const usuarioActivos = {
    id: usuario.id_personas,
    activo: usuario.activo
  };

  console.log('Datos obtenidos para actualizar estado:', usuarioActivos);

  this.editarService.editarUsuario(usuarioActivos).subscribe(
    (response: any) => {
      console.log(`Estado de usuario ${usuario.nombre} actualizado a ${usuario.activo === 1 ? 'Activo' : 'Inactivo'}`);

      this.obtenerUsuarios();
    },
    (error: any) => {
      console.error('Error al actualizar el estado de activo:', error);
      usuario.activo = usuario.activo === 1 ? 0 : 1;
        if (error.status === 404) {
          this.errorMessage = 'El usuario no fue encontrado para eliminar.';
        } else {
          this.errorMessage = 'No se ha Iniciado Sesion.';
        }
    }
  );
}


opensesionDialog(usuario: any): void {
  this.selectedUsuario = { ...usuario };
  this.username = { ...usuario };
  this.username.id = usuario.id_personas;
  this.username.alias = usuario.alias;

  (document.getElementById('modal5') as HTMLDialogElement).showModal();
  console.log("Usuario a editar:", this.username.id);
  console.log("Usuario a editar:", this.username);
}

closesesionFormDialog(): void {
  (document.getElementById('modal5') as HTMLDialogElement).close();
}

eorsesion(): void {
  if (!this.selectedUsuario) return;

  if (!this.username.alias) {
    if (!this.username.username || !this.username.password || !this.username.conpassword) {
      this.error = 'Todos los campos son obligatorios, wey.';
      console.error("❌ Faltan datos:", this.username);
      return;
    }
    if (this.username.password.length < 8) {
      this.error = 'La contraseña debe tener al menos 8 caracteres.';
      console.error("❌ Contraseña demasiado corta");
      return;
    }
    if (this.username.password !== this.username.conpassword) {
      this.error = 'Las contraseñas no coinciden, cabrón.';
      console.error("❌ Las contraseñas no coinciden");
      return;
    }
    const data = {
      id_persona: this.selectedUsuario.id_personas,
      username: this.username.username,
      password: this.username.password
    };

    console.log("⚡ Enviando datos de registro:", data);

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
          if (error.status === 404) {
          this.errorMessage = 'El usuario no fue encontrado para eliminar.';
        } else {
          this.errorMessage = 'No se ha Iniciado Sesion.';
        }
      }

    );
  } else {

    this.username.id = this.selectedUsuario.id_personas;
    console.log("Usuario a editar:", this.username);

    for (const key in this.username) {
      if (this.username[key] === '' || this.username[key] === null) {
        console.error(`Error: El campo ${key} está vacío.`);
        this.error = `El campo ${key} está vacío, por favor complete todos los campos.`;
        return;
      }
    }

    const cambios = Object.keys(this.username).some(
      (key) => this.username[key] !== this.selectedUsuario[key]
    );

    if (!cambios) {
      console.log('No hay cambios en los datos, no se actualiza.');
      this.closesesionFormDialog()
      return;
    }
    console.log('Usuarios',cambios );
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
          if (error.status === 404) {
          this.errorMessage = 'El usuario no fue encontrado para eliminar.';
        } else {
          this.errorMessage = 'No se ha Iniciado Sesion.';
        }
      }
    );
  }
}


}
