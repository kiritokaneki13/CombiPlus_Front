import '@angular/compiler'; // Solo necesario si usas JIT explícitamente
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import { AppComponent } from './app/app.component';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

bootstrapApplication(AppComponent).catch((err) => console.error(err));
