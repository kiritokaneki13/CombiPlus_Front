import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class FirebaseService {
  private combisRef: AngularFireList<any>; // Referencia inicializada en el constructor

  constructor(private db: AngularFireDatabase) {
    console.log('📢 [FirebaseService] Constructor ejecutado, db:', this.db);
    this.combisRef = this.db.list('usuarios/usuario1/usuarios'); // Inicializamos aquí
    console.log('📢 [FirebaseService] Referencia combisRef creada:', this.combisRef);
  }

  obtenerCombisActivas(): Observable<any[]> {
    console.log('📢 [FirebaseService] Iniciando obtenerCombisActivas');
    try {
      return this.combisRef.snapshotChanges().pipe(
        map(changes => {
          console.log('📢 [FirebaseService] Cambios obtenidos:', changes);
          const result = changes.map(c => ({
            key: c.payload.key,
            ...c.payload.val() as any
          }));
          console.log('📢 [FirebaseService] Datos mapeados:', result);
          const activeUsers = result.filter(user => user.activo === true);
          console.log('📢 [FirebaseService] Usuarios activos:', activeUsers);
          return activeUsers;
        })
      );
    } catch (e) {
      console.error('❌ [FirebaseService] Excepción en obtenerCombisActivas:', e);
      throw e;
    }
  }
}
