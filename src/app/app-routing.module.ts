import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReservacionesComponent } from './reservaciones/reservaciones.component';
import { AvisosComponent } from './avisos/avisos.component';
import { LoginComponent } from './login/login.component';
import { CierresComponent } from './home/estado-gym/cierres/cierres.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'inicio', component: HomeComponent},
  {path: 'reservaciones', component: ReservacionesComponent},
  {path: 'avisos', component: AvisosComponent},
  {path: 'cierres', component: CierresComponent} //Solo para pruebas, borrar despuéss
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
