import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReservacionesComponent } from './reservaciones/reservaciones.component';
import { AvisosComponent } from './avisos/avisos.component';
import { LoginComponent } from './login/login.component';
import { MisReservasComponent } from './mis-reservas/mis-reservas.component';
import { EspacioComponent } from './reservaciones/espacio/espacio.component';

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
    component: ReservacionesComponent,
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
    path: 'reservarEspacio/:id',
    component: EspacioComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
