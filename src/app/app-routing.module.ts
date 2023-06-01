import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReservacionesComponent } from './reservaciones/reservaciones.component';
import { AvisosComponent } from './avisos/avisos.component';
import { LoginComponent } from './login/login.component';
import { MisReservasComponent } from './mis-reservas/mis-reservas.component';
import { EspacioComponent } from './reservaciones/espacio/espacio.component';
import { ReservarEspacioComponent } from './reservaciones/espacio/reservar-espacio/reservar-espacio.component';
import { EstadisticasAdminComponent } from './estadisticas-admin/estadisticas-admin.component';

const routes: Routes = [
  {
    path: '', 
    component: LoginComponent
  },
  {
    path: 'inicio', 
    component: HomeComponent
  },
  {
    path: 'reservaciones', 
    component: ReservacionesComponent
  },
  {
    path: 'misreservas', 
    component: MisReservasComponent
  },
  {
    path: 'avisos', 
    component: AvisosComponent
  },
  {
    path: 'reservarCancha/:id',
    component: EspacioComponent
  },
  {
    path: 'reservarEspacio/:id',
    component: ReservarEspacioComponent
  },
  {
    path: 'estadisticas',
    component: EstadisticasAdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
