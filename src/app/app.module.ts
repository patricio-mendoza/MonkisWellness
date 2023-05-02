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

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs, 'es');

import { NgCircleProgressModule } from 'ng-circle-progress';
import { bufferToggle } from 'rxjs';
import { GrafPorcentajeComponent } from './home/estado-gym/graf-porcentaje/graf-porcentaje.component';
import { EstimacionesComponent } from './home/horas-proximas/estimaciones/estimaciones.component';
import { EstimacionesDosComponent } from './home/horas-proximas/estimaciones-dos/estimaciones-dos.component';
import { EstimacionesTresComponent } from './home/horas-proximas/estimaciones-tres/estimaciones-tres.component';
import { HoraMinutoComponent } from './home/horas-proximas/estimaciones/hora-minuto/hora-minuto.component';
import { HoraMinutoDosComponent } from './home/horas-proximas/estimaciones-dos/hora-minuto-dos/hora-minuto-dos.component';
import { HoraMinutoTresComponent } from './home/horas-proximas/estimaciones-tres/hora-minuto-tres/hora-minuto-tres.component';

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
    GrafPorcentajeComponent,
    EstimacionesComponent,
    EstimacionesDosComponent,
    EstimacionesTresComponent,
    HoraMinutoComponent,
    HoraMinutoDosComponent,
    HoraMinutoTresComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgCircleProgressModule.forRoot({
      "radius": 100,
      "space": -10,
      "outerStrokeGradient": false,
      "outerStrokeWidth": 15,
      "outerStrokeColor": "#D9D9D9",
      //"outerStrokeGradientStopColor": "#D9D9D9",
      "innerStrokeColor": "#D9D9D9",
      "innerStrokeWidth": 20,
      //"title": "titulo" ,
      "titleColor" : "#ffffff",
      "titleFontSize" : "60",
      "titleFontWeight":"10",
      "animateTitle": false,
      "subtitleColor" : "#ffffff", 
      "subtitleFontSize" : "20",
      "animationDuration": 1000,
      "showUnits": false,
      "showBackground": true,
      "backgroundColor": "#004891",
      "clockwise": true,
      "startFromZero": false,
      "lazy": true})
  ],
  providers: 
  [DatePipe, {provide: LOCALE_ID, useValue: 'es'}
  

],
  
  bootstrap: [AppComponent]
})
export class AppModule { 
}
