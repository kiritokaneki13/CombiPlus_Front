import { Component, OnInit } from '@angular/core';
import { RutasService } from './../service/rutas.service';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common'; // 👈 IMPORTA CommonModule
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {
  map!: L.Map;
  rutas: any[] = [];
  paradas: any[] = [];
  rutaLayer!: L.LayerGroup;
  paradaLayer!: L.LayerGroup;
  selectedRutaId: string | null = null; // Para binding con ngModel
  selectedParadaId: string | null = null; // Para binding con ngModel

  constructor(private rutasService: RutasService) {
    console.log('Constructor: Instancia de MapaComponent creada');
  }

  ngOnInit(): void {
    console.log('ngOnInit: Iniciando componente');
    this.initMap();
    this.obtenerRutas();
    this.obtenerParadas();
  }

  initMap(): void {
    console.log('initMap: Inicializando el mapa');
    this.map = L.map('map').setView([17.9869, -92.9303], 12);
    console.log('initMap: Mapa creado con vista inicial en [17.9869, -92.9303], zoom 12');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    console.log('initMap: Capa de tiles de OpenStreetMap añadida');

    this.rutaLayer = L.layerGroup().addTo(this.map);
    this.paradaLayer = L.layerGroup().addTo(this.map);
    console.log('initMap: Capas rutaLayer y paradaLayer creadas y añadidas al mapa');
  }

  limpiarMapa(): void {
    console.log('limpiarMapa: Limpiando capas del mapa');
    this.rutaLayer.clearLayers();
    this.paradaLayer.clearLayers();
    console.log('limpiarMapa: Capas rutaLayer y paradaLayer limpiadas');
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
    console.log('obtenerParadas: Solicitando paradas al servicio');
    this.rutasService.obtenerParadas().subscribe(
      (data) => {
        console.log('obtenerParadas: Datos recibidos del servicio:', data);
        this.paradas = data;
        console.log('obtenerParadas: Paradas asignadas a this.paradas:', this.paradas);
      },
      (error) => {
        console.error('obtenerParadas: Error al obtener paradas:', error);
      }
    );
  }

  onRutaChange(): void {
    console.log('onRutaChange: Ruta seleccionada con ID:', this.selectedRutaId);
    this.limpiarMapa();

    if (this.selectedRutaId) {
      console.log('onRutaChange: Buscando ruta con ID:', this.selectedRutaId);
      const rutaSeleccionada = this.rutas.find(r => r.id_ruta == this.selectedRutaId);
      console.log('onRutaChange: Ruta encontrada:', rutaSeleccionada);

      if (rutaSeleccionada) {
        const coordenadas = rutaSeleccionada.coordenadas.map((coord: any) => [coord.lat, coord.lng]);
        console.log('onRutaChange: Coordenadas procesadas:', coordenadas);

        const polyline = L.polyline(coordenadas, {
          color: '#007bff',
          weight: 5,
          opacity: 0.8,
          dashArray: '10, 5'
        }).addTo(this.rutaLayer);
        console.log('onRutaChange: Polilínea añadida al rutaLayer:', polyline);

        this.map.fitBounds(polyline.getBounds());
        console.log('onRutaChange: Mapa ajustado a los límites de la ruta');
      } else {
        console.log('onRutaChange: No se encontró la ruta con ID:', this.selectedRutaId);
      }
    } else {
      console.log('onRutaChange: No se seleccionó ninguna ruta (valor vacío)');
    }
  }

  onParadaChange(): void {
    console.log('onParadaChange: Parada seleccionada con ID:', this.selectedParadaId);
    this.limpiarMapa();

    if (this.selectedParadaId) {
      console.log('onParadaChange: Buscando parada con ID:', this.selectedParadaId);
      const paradaSeleccionada = this.paradas.find(p => p.id_parada == this.selectedParadaId);
      console.log('onParadaChange: Parada encontrada:', paradaSeleccionada);

      if (paradaSeleccionada) {
        const marker = L.marker([paradaSeleccionada.latitud, paradaSeleccionada.longitud])
          .addTo(this.paradaLayer)
          .bindPopup(paradaSeleccionada.nombre)
          .openPopup();
        console.log('onParadaChange: Marcador añadido al paradaLayer:', marker);

        this.map.setView([paradaSeleccionada.latitud, paradaSeleccionada.longitud], 14);
        console.log('onParadaChange: Mapa centrado en la parada con zoom 14');
      } else {
        console.log('onParadaChange: No se encontró la parada con ID:', this.selectedParadaId);
      }
    } else {
      console.log('onParadaChange: No se seleccionó ninguna parada (valor vacío)');
    }
  }
}
