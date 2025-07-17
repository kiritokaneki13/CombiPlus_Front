import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { RegistroNameComponent } from './registro-name/registro-name.component';
import { RegistroTipopComponent } from './registro-tipop/registro-tipop.component';
import { RegistroUsernameComponent } from './registro-username/registro-username.component';
import { IndexJefeComponent } from './index-jefe/index-jefe.component';
import { MapaComponent } from './mapa/mapa.component';
import { MapaAdminComponent } from './mapa-admin/mapa-admin.component';

const routes: Routes = [
  { path: 'index', component: IndexComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'registrop1', component: RegistroNameComponent },
  { path: 'registrotp', component: RegistroTipopComponent },
  { path: 'registrou', component: RegistroUsernameComponent },
  { path: 'indexj', component: IndexJefeComponent},
  { path: 'mapa', component: MapaComponent},
  { path:'mapa-admin', component: MapaAdminComponent}



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
