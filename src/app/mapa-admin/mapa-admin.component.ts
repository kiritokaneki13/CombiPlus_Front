import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { RutasService } from './../service/rutas.service';
import { FirebaseService } from './../service/firebase.service';
import 'leaflet-draw';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common'; // 👈 IMPORTA CommonModule
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-mapa-admin',
  templateUrl: './mapa-admin.component.html',
  styleUrls: ['./mapa-admin.component.css'],
  providers: [FirebaseService]
})
export class MapaAdminComponent implements OnInit {
  map!: L.Map;
  rutas: any[] = [];
  paradas: any[] = [];
  selectedRutaId: string | null = null;
  selectedParadaId: string | null = null;

  // Edición
  editandoRuta: boolean = false;
  editandoParada: boolean = false;
  rutaEditable!: L.Polyline;
  paradaEditable!: L.Marker;
  featureGroup!: L.FeatureGroup;
  drawControl!: L.Control.Draw;

  // Otros atributos
  simulacionActiva: boolean = false;
  combiMarker!: L.Marker;
  rutaCoordenadas: L.LatLng[] = [];
  puntoIntermedioIndex: number = 0;
  combiMarkers: any[] = [];

  private paradaIcon = L.divIcon({
    html: `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="7" r="4" stroke="#B38E5D" stroke-width="2" fill="white"/>
        <rect x="11" y="11" width="2" height="8" fill="#B38E5D"/>
        <circle cx="12" cy="22" r="2" fill="#B38E5D"/>
      </svg>
    `,
    className: 'custom-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });


  private simulacionIcon = L.divIcon({
    html: `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.5">
          <path d="M20 10H18V6C18 5.4477 17.5523 5 17 5H7C6.4477 5 6 5.4477 6 6V10H4C3.4477 10 3 10.4477 3 11V15C3 15.5523 3.4477 16 4 16H5V18C5 18.5523 5.4477 19 6 19H8C8.5523 19 9 18.5523 9 18V16H15V18C15 18.5523 15.4477 19 16 19H18C18.5523 19 19 18.5523 19 18V16H20C20.5523 16 21 15.5523 21 15V11C21 10.4477 20.5523 10 20 10Z" fill="#9F2C4A"/>
          <circle cx="8" cy="13" r="1.5" fill="#FFF"/>
          <circle cx="16" cy="13" r="1.5" fill="#FFF"/>
        </g>
        <path d="M2 22L22 22" stroke="#9F2C4A" stroke-dasharray="2 2"/>
      </svg>
    `,
    className: 'custom-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });


  private combiIcon = L.divIcon({
    html: `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 10H18V6C18 5.4477 17.5523 5 17 5H7C6.4477 5 6 5.4477 6 6V10H4C3.4477 10 3 10.4477 3 11V15C3 15.5523 3.4477 16 4 16H5V18C5 18.5523 5.4477 19 6 19H8C8.5523 19 9 18.5523 9 18V16H15V18C15 18.5523 15.4477 19 16 19H18C18.5523 19 19 18.5523 19 18V16H20C20.5523 16 21 15.5523 21 15V11C21 10.4477 20.5523 10 20 10Z" fill="#28A745"/>
        <circle cx="8" cy="13" r="1.5" fill="#FFF"/>
        <circle cx="16" cy="13" r="1.5" fill="#FFF"/>
        <path d="M2 22H6M18 22H22" stroke="#28A745" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `,
    className: 'custom-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });



  constructor(
    private rutasService: RutasService,
    private firebaseService: FirebaseService,
    private cdRef: ChangeDetectorRef,
    private zone: NgZone
  ) {}
  ngOnInit(): void {
    this.initMap();
    this.obtenerRutas();
    this.obtenerParadas();
  }

  initMap(): void {
    this.map = L.map('map').setView([17.9869, -92.9303], 12);
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://stadiamaps.com/">Stadia Maps</a>, © <a href="https://openmaptiles.org/">OpenMapTiles</a>, © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 20,
    }).addTo(this.map);
    this.featureGroup = new L.FeatureGroup().addTo(this.map);
  }


  limpiarMapa(): void {
    this.featureGroup.clearLayers();
  }
  activarEdicionRuta(): void {
    this.limpiarTodo();
    this.editandoRuta = true;

    const rutaSeleccionada = this.rutas.find(r => r.id_ruta == this.selectedRutaId);
    if (rutaSeleccionada) {
      const coordenadas = rutaSeleccionada.coordenadas.map((coord: any) => [coord.lat, coord.lng]);
      this.rutaEditable = L.polyline(coordenadas, { color: '#42a5f5', weight: 5, opacity: 0.8 }).addTo(this.featureGroup);
      this.map.fitBounds(this.rutaEditable.getBounds());

      this.drawControl = new L.Control.Draw({
        draw: {
          polyline: false,
          polygon: false,
          circle: false,
          rectangle: false,
          marker: false,
          circlemarker: false
        },
        edit: {
          featureGroup: this.featureGroup,
          remove: false
        }
      });

      this.map.addControl(this.drawControl);
    }
  }

  activarEdicionParada(): void {
    this.limpiarTodo();
    this.editandoParada = true;

    const paradaSeleccionada = this.paradas.find(p => p.id_parada == this.selectedParadaId);
    if (paradaSeleccionada) {
      this.paradaEditable = L.marker([paradaSeleccionada.latitud, paradaSeleccionada.longitud], {
        icon: this.paradaIcon,
        draggable: true
      }).addTo(this.featureGroup).bindPopup(paradaSeleccionada.nombre).openPopup();

      this.drawControl = new L.Control.Draw({
        draw: {
          polyline: false,
          polygon: false,
          circle: false,
          rectangle: false,
          marker: false,
          circlemarker: false
        },
        edit: {
          featureGroup: this.featureGroup,
          remove: false
        }
      });

      this.map.addControl(this.drawControl);
    }
  }

  limpiarTodo(): void {
    this.featureGroup.clearLayers();
    if (this.rutaEditable) this.map.removeLayer(this.rutaEditable);
    if (this.paradaEditable) this.map.removeLayer(this.paradaEditable);
    this.editandoRuta = false;
    this.editandoParada = false;
    if (this.drawControl) this.map.removeControl(this.drawControl);
  }

  obtenerRutas(): void {
    this.rutasService.obtenerRutas().subscribe(
      (data) => {
        console.log("✅ Datos recibidos de la API:", data);

        this.rutas = data.map((ruta: any) => {
          console.log("✅ Ruta recibida:", ruta);

          // Si las coordenadas son una cadena, intentamos parsearlas
          if (typeof ruta.coordenadas === 'string') {
            try {
              ruta.coordenadas = JSON.parse(ruta.coordenadas);
              console.log("✅ Coordenadas parseadas para la ruta con id", ruta.id_ruta, ":", ruta.coordenadas);
            } catch (e) {
              console.error('❌ Error parseando coordenadas de ruta', ruta.id_ruta, ':', e);
            }
          }

          // Si las coordenadas ya son un array, verificamos que no estén anidadas
          if (Array.isArray(ruta.coordenadas)) {
            // Si es un array dentro de un array, lo desanidamos
            if (Array.isArray(ruta.coordenadas[0])) {
              ruta.coordenadas = ruta.coordenadas[0];
              console.log("✅ Coordenadas desanidadas para la ruta con id", ruta.id_ruta, ":", ruta.coordenadas);
            }
          }

          return ruta;
        });

        console.log("✅ Rutas procesadas:", this.rutas);
      },
      (error) => console.error('❌ Error al obtener rutas:', error)
    );
  }

  obtenerParadas(): void {
    this.rutasService.obtenerParadas().subscribe(
      (data) => {
        this.paradas = data;
      },
      (error) => console.error('Error al obtener paradas:', error)
    );
  }

  onRutaChange(): void {
    this.limpiarMapa();
    this.obtenerRutas();
    this.editandoRuta = false;
    if (this.selectedRutaId) {
      const rutaSeleccionada = this.rutas.find(r => r.id_ruta == this.selectedRutaId);
      if (rutaSeleccionada) {
        const coordenadas = rutaSeleccionada.coordenadas.map((coord: any) => [coord.lat, coord.lng]);
        const polyline = L.polyline(coordenadas, { color: '#007bff', weight: 5 }).addTo(this.featureGroup);
        this.map.fitBounds(polyline.getBounds());
      }
    }
  }

  onParadaChange(): void {
    this.limpiarMapa();
    this.editandoParada = false;
    if (this.selectedParadaId) {
      const paradaSeleccionada = this.paradas.find(p => p.id_parada == this.selectedParadaId);
      if (paradaSeleccionada) {
        const marker = L.marker([paradaSeleccionada.latitud, paradaSeleccionada.longitud])
          .addTo(this.featureGroup)
          .bindPopup(paradaSeleccionada.nombre)
          .openPopup();
        this.map.setView([paradaSeleccionada.latitud, paradaSeleccionada.longitud], 14);
      }
    }
  }


  // **Eliminar Ruta Seleccionada**
  eliminarRutaSeleccionada(): void {
    if (!this.selectedRutaId) return;
    const confirmacion = confirm('¿Seguro que deseas eliminar esta ruta?');
    if (confirmacion) {
      this.rutasService.eliminarRuta(Number(this.selectedRutaId)).subscribe(
        () => {
          this.selectedRutaId = null;
          this.obtenerRutas();
          this.limpiarMapa();
        },
        (error) => console.error('Error al eliminar ruta:', error)
      );
    }
  }

  // **Eliminar Parada Seleccionada**
  eliminarParadaSeleccionada(): void {
    if (!this.selectedParadaId) return;
    const confirmacion = confirm('¿Seguro que deseas eliminar esta parada?');
    if (confirmacion) {
      this.rutasService.eliminarParada(Number(this.selectedParadaId)).subscribe(
        () => {
          this.selectedParadaId = null;
          this.obtenerParadas();
          this.limpiarMapa();
        },
        (error) => console.error('Error al eliminar parada:', error)
      );
    }
  }

  editarRuta(): void {
    if (this.editandoRuta) {
      const nuevasCoordenadas = (this.rutaEditable.getLatLngs() as L.LatLng[]).map((latLng) => ({
        lat: latLng.lat,
        lng: latLng.lng
      }));

      const ruta = {
        nombre: this.rutas.find(r => r.id_ruta == this.selectedRutaId)?.nombre,
        coordenadas: nuevasCoordenadas
      };

      this.rutasService.editarRuta(Number(this.selectedRutaId), ruta).subscribe(
        () => {
          this.editandoRuta = false;
          this.initMap();
          this.limpiarMapa();
          this.obtenerRutas();
          this.onRutaChange();
        },
        (error) => console.error('Error al guardar ruta:', error)
      );
    } else {
      this.limpiarMapa();

      // Verificar si ya existe un control de edición, si no, crear uno
      if (!this.drawControl) {
        const rutaSeleccionada = this.rutas.find(r => r.id_ruta == this.selectedRutaId);
        if (rutaSeleccionada) {
          const coordenadas = rutaSeleccionada.coordenadas.map((coord: any) => [coord.lat, coord.lng]);
          this.rutaEditable = L.polyline(coordenadas, { color: '#ff0000', weight: 5 }).addTo(this.featureGroup);

          const editableLayer = new L.FeatureGroup([this.rutaEditable]);
          this.map.addLayer(editableLayer);

          // Crear el control de edición si no existe
          this.drawControl = new L.Control.Draw({
            edit: { featureGroup: editableLayer, remove: false }
          });

          this.map.addControl(this.drawControl);
        }
      }

      // Marcar que se está editando la ruta
      this.editandoRuta = true;
    }
  }
 // **Editar Parada**
  editarParada(): void {
    if (this.editandoParada) {
      const nuevaPosicion = this.paradaEditable.getLatLng();
      const parada = {
        nombre: this.paradas.find(p => p.id_parada == this.selectedParadaId)?.nombre,
        latitud: nuevaPosicion.lat,
        longitud: nuevaPosicion.lng
      };

      this.rutasService.editarParada(Number(this.selectedParadaId), parada).subscribe(
        () => {
          this.editandoParada = false;
          this.limpiarMapa();
          this.obtenerParadas();
          this.onParadaChange();
        },
        (error) => console.error('Error al guardar parada:', error)
      );
    } else {
      this.limpiarMapa();
      const paradaSeleccionada = this.paradas.find(p => p.id_parada == this.selectedParadaId);
      if (paradaSeleccionada) {
        this.paradaEditable = L.marker([paradaSeleccionada.latitud, paradaSeleccionada.longitud], {
          draggable: true
        }).addTo(this.featureGroup).bindPopup(paradaSeleccionada.nombre).openPopup();

        this.editandoParada = true;
      }
    }
  }
  mostrarTodasLasParadas(): void {

    this.paradas.forEach(parada => {
      L.marker([parada.latitud, parada.longitud], { icon: this.paradaIcon })
        .addTo(this.featureGroup)
        .bindPopup(`<b>${parada.nombre}</b>`)
        .openPopup();
    });

    console.log("✅ Se mostraron todas las paradas en el mapa.");
  }
  habilitarSimulacion(): void {
    if (this.simulacionActiva) {
      console.log('La simulación ya está activa, wey.');
      return;
    }

    this.simulacionActiva = true;
    console.log('🚀 Simulación habilitada.');

    const combiIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
      shadowSize: [41, 41]
    });

    const rutaSeleccionada = this.rutas.find(r => r.id_ruta == this.selectedRutaId);
    if (rutaSeleccionada) {
      this.rutaCoordenadas = rutaSeleccionada.coordenadas.map((coord: any) => L.latLng(coord.lat, coord.lng));

      this.combiMarker = L.marker(this.rutaCoordenadas[0], { icon: this.simulacionIcon })
        .addTo(this.featureGroup);
      this.moverCombi();
    }
  }


  // Función para generar puntos intermedios
  generarPuntosIntermedios(p1: L.LatLng, p2: L.LatLng, pasos: number): L.LatLng[] {
    let puntos: L.LatLng[] = [];
    for (let i = 0; i <= pasos; i++) {
      let lat = p1.lat + (p2.lat - p1.lat) * (i / pasos);
      let lng = p1.lng + (p2.lng - p1.lng) * (i / pasos);
      puntos.push(L.latLng(lat, lng));
    }
    return puntos;
  }

  // Función para mover la combi de manera fluida
// Función para mover la combi de manera fluida
moverCombi(): void {
  if (this.puntoIntermedioIndex < this.rutaCoordenadas.length - 1) {
    // Generamos puntos intermedios entre dos puntos consecutivos
    const puntosIntermedios = this.generarPuntosIntermedios(
      this.rutaCoordenadas[this.puntoIntermedioIndex],
      this.rutaCoordenadas[this.puntoIntermedioIndex + 1],
      10 // Más pasos = más fluido
    );

    let i = 0;
    const mover = () => {
      if (i < puntosIntermedios.length) {
        this.combiMarker.setLatLng(puntosIntermedios[i]);
        i++;
        // Hacemos el movimiento más suave con un timeout
        setTimeout(mover, 100); // 100ms entre cada movimiento, puedes ajustarlo según el nivel de fluidez
      } else {
        this.puntoIntermedioIndex++;
        this.moverCombi(); // Avanzamos al siguiente tramo de la ruta
      }
    };

    mover(); // Inicia el movimiento
  } else {
    // La simulación termina
    this.deshabilitarSimulacion();
  }
}



  // Función para deshabilitar la simulación
  deshabilitarSimulacion(): void {
    if (!this.simulacionActiva) {
      console.log('La simulación ya está desactivada, cabrón.');
      return;
    }

    this.simulacionActiva = false;
    console.log('🛑 Simulación deshabilitada.');
  }

  obtenerCombisActivas() {
    console.log('📢 [MapaAdminComponent] Iniciando obtenerCombisActivas');
    console.log('📢 [MapaAdminComponent] Estado de this.firebaseService:', this.firebaseService);
    this.zone.run(() => {
      console.log('📢 [MapaAdminComponent] Dentro de NgZone');
      this.firebaseService.obtenerCombisActivas().subscribe({
        next: (combis: any[]) => {
          console.log('🚐 [MapaAdminComponent] Combis activas recibidas:', combis);
          this.combiMarkers.forEach(marker => {
            console.log('📢 [MapaAdminComponent] Eliminando marcador:', marker);
            this.map.removeLayer(marker);
          });
          this.combiMarkers = [];
          console.log('📢 [MapaAdminComponent] Marcadores limpiados');
          combis.forEach((combi, index) => {
            console.log(`📢 [MapaAdminComponent] Procesando combi ${index}:`, combi);
            if (combi.coordenadas?.length > 0) {
              const ultimaUbicacion = combi.coordenadas[combi.coordenadas.length - 1];
              console.log(`📢 [MapaAdminComponent] Última ubicación de combi ${index}:`, ultimaUbicacion);
              const marker = L.marker([ultimaUbicacion.lat, ultimaUbicacion.lng], { icon: this.combiIcon })
                .addTo(this.map)
                .bindPopup(`<b>${combi.nombre || 'Sin nombre'}</b>`);
              this.combiMarkers.push(marker);
              console.log(`📢 [MapaAdminComponent] Marcador añadido para combi ${index}`);
            } else {
              console.warn(`⚠️ [MapaAdminComponent] Combi ${combi.nombre || 'sin nombre'} no tiene coordenadas`);
            }
          });
          this.cdRef.detectChanges();
          console.log('📢 [MapaAdminComponent] Detección de cambios ejecutada');
        },
        error: (error) => console.error('❌ [MapaAdminComponent] Error al obtener combis:', error),
        complete: () => console.log('📢 [MapaAdminComponent] Suscripción completada')
      });
    });
  }
}

