// Home.component.ts
// Componente base que contiene los subcomponentes de la página principal y les manda información e instancias relevantes
// Autores:
// Daniel Evaristo Escalera Bonilla
//Omar Cota Rodríguez
// 17/04/2021


import { Component } from '@angular/core';
import { CompartidovarService } from './compartidorvar-service/compartidovar.service';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  isAdmin = localStorage.getItem("isAdmin") === "true";
  newAforo: string;
  
  time = new Date();
  dia: string = dias[this.time.getDay()];
  
  // Crea las instancias de Location, Http Client y Compartidor service que se utilizan en los subcomponentes
  constructor(public location: Location, public http: HttpClient, public miServicio : CompartidovarService){
  }

  // Abre y cierra la tarjeta de modificar aforo
  ocultar(){
    this.miServicio.isModifyingAforo = !this.miServicio.isModifyingAforo;
  }

  // Abre y cierra la tarjeta de cierres
  cierresTab(){
    this.miServicio.isClosing = !this.miServicio.isClosing;
  }
  
  // Abre y cierra la gráfica esta-semana
  openEstaSemanaTab() {
    this.miServicio.isCheckingEstaSemana = true;
  }

  // Abre y cierra la gráfica historial
  openHistorial(){
    this.miServicio.isCheckingHistorial = true;
  }
}
