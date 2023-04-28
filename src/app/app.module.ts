import { LOCALE_ID ,NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { HomeComponent } from './home/home.component';
import { ReservacionesComponent } from './reservaciones/reservaciones.component';
import { AvisosComponent } from './avisos/avisos.component';
import { LoginComponent } from './login/login.component';
import { EstadoGymComponent } from './home/estado-gym/estado-gym.component';
import { HeaderComponent } from './header/header.component';
import { HorasProximasComponent } from './home/horas-proximas/horas-proximas.component';
import { EstaSemanaComponent } from './home/esta-semana/esta-semana.component';
import { HistorialComponent } from './home/historial/historial.component';
import { GrafPorcentajeComponent } from './home/estado-gym/graf-porcentaje/graf-porcentaje.component';

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { SublevelMenuComponent } from './sidenav/sublevel-menu.component';
import { MisReservasComponent } from './mis-reservas/mis-reservas.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { bufferToggle } from 'rxjs';

registerLocaleData(localeEs, 'es');
@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    HomeComponent,
    ReservacionesComponent,
    AvisosComponent,
    LoginComponent,
    EstadoGymComponent,
    HeaderComponent,
    HorasProximasComponent,
    EstaSemanaComponent,
    HistorialComponent,
    SublevelMenuComponent,
    GrafPorcentajeComponent,
    MisReservasComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    })
  ],
  providers: [DatePipe, {provide: LOCALE_ID, useValue: 'es'}],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
