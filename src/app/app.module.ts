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
import { CierresComponent } from './home/estado-gym/cierres/cierres.component';
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
    CierresComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [DatePipe, {provide: LOCALE_ID, useValue: 'es'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
