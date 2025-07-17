import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from './environments/firebase.environments';
import { FirebaseService } from './service/firebase.service';

// Componentes standalone
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { RegistroNameComponent } from './registro-name/registro-name.component';
import { RegistroTipopComponent } from './registro-tipop/registro-tipop.component';
import { RegistroUsernameComponent } from './registro-username/registro-username.component';
import { IndexJefeComponent } from './index-jefe/index-jefe.component';
import { MapaComponent } from './mapa/mapa.component';
import { MapaAdminComponent } from './mapa-admin/mapa-admin.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AppComponent,
    IndexComponent,
    LoginComponent,
    AdminComponent,
    RegistroNameComponent,
    RegistroTipopComponent,
    RegistroUsernameComponent,
    IndexJefeComponent,
    MapaComponent,
    MapaAdminComponent,
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule {}
