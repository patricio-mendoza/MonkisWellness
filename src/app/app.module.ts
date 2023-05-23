import { MbscModule } from '@mobiscroll/angular';
import { LOCALE_ID ,NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import localeEs from '@angular/common/locales/es';

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
import { registerLocaleData } from '@angular/common';
import { SublevelMenuComponent } from './sidenav/sublevel-menu.component';
import { MisReservasComponent } from './mis-reservas/mis-reservas.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { GrafPorcentajeComponent } from './home/estado-gym/graf-porcentaje/graf-porcentaje.component';
import { EstimacionesComponent } from './home/horas-proximas/estimaciones/estimaciones.component';
import { HoraMinutoComponent } from './home/horas-proximas/estimaciones/hora-minuto/hora-minuto.component';
import { EspacioComponent } from './reservaciones/espacio/espacio.component';
import { ReservarEspacioComponent } from './reservaciones/espacio/reservar-espacio/reservar-espacio.component';
import { ProgramarCierreComponent } from './home/estado-gym/programar-cierre/programar-cierre.component';
import { ModifAforoComponent } from './home/modif-aforo/modif-aforo.component';
import { EstaSemanaPopUpComponent } from './home/esta-semana/esta-semana-pop-up/esta-semana-pop-up.component';
import { BarChartComponent } from './home/esta-semana/esta-semana-pop-up/bar-chart/bar-chart.component';
import { GrafEstanciaPromComponent } from './graf-estancia-prom/graf-estancia-prom.component';


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
    EstimacionesComponent,
    HoraMinutoComponent,
    MisReservasComponent,
    EspacioComponent,
    ReservarEspacioComponent,
    ProgramarCierreComponent,
    ModifAforoComponent,
    EstaSemanaPopUpComponent,
    BarChartComponent,
    GrafEstanciaPromComponent,
  ],
  imports: [  
    MbscModule,   
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
      "innerStrokeWidth": 20,
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
