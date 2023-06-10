// HomeComponent.ts
// Componente de la página principal donde se despliegan las diferentes secciones funcionales

import { Component } from '@angular/core';
import { CompartidovarService } from './compartidovar.service';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

// Arreglo de días que con su posición indican el número del día de las semana 
const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent {

  isAdmin = localStorage.getItem("isAdmin") === "true"; // Variable que utilizan distintos subcomponentes para indicar si el usuario es administrador
  
  time = new Date();
  dia: string = dias[this.time.getDay()];

  constructor(public location: Location, public http: HttpClient, public miServicio : CompartidovarService){
  }

  ocultar(){
    this.miServicio.isModifyingAforo = !this.miServicio.isModifyingAforo;
  }

  cierresTab(){
    this.miServicio.isClosing = !this.miServicio.isClosing;
  }

  openEstaSemanaTab() {
    this.miServicio.isCheckingEstaSemana = true;
  }

  openHistorial(){
    this.miServicio.isCheckingHistorial = true;
  }
}
