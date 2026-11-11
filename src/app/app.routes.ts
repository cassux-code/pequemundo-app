import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { InicioComponent } from './modules/inicio/inicio.component';
import { VocabularioComponent } from './modules/vocabularios/vocabulario.component';
import { MatematicasComponent } from './modules/matematicas/matematicas.component';
import { ArteSonidoComponent } from './modules/arte-sonido/arte-sonido.component';
import { LogrosReportesComponent } from './modules/logros-reportes/logros-reportes.component';
import { PerfilesRolesComponent } from './modules/perfiles-roles/perfiles-roles.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent, canActivate: [authGuard] },
  { path: 'vocabulario', component: VocabularioComponent, canActivate: [authGuard] },
  { path: 'matematicas', component: MatematicasComponent, canActivate: [authGuard] },
  { path: 'arte-sonido', component: ArteSonidoComponent, canActivate: [authGuard] },
  { path: 'logros-reportes', component: LogrosReportesComponent, canActivate: [authGuard] },
  { path: 'perfiles-roles', component: PerfilesRolesComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
