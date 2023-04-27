import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { HomeComponent } from './home/home.component';
import { ReservacionesComponent } from './reservaciones/reservaciones.component';
import { AvisosComponent } from './avisos/avisos.component';
import { LoginComponent } from './login/login.component';
import { GrafPorcentajeComponent } from './graf-porcentaje/graf-porcentaje.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { bufferToggle } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    HomeComponent,
    ReservacionesComponent,
    AvisosComponent,
    LoginComponent,
    GrafPorcentajeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
