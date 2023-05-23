import { Component } from '@angular/core';
import { CompartidovarService } from './compartidovar.service';
import { HttpClient } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';

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

  constructor(public http: HttpClient, public miServicio : CompartidovarService){}

  ocultar(){
    this.miServicio.isModifyingAforo = !this.miServicio.isModifyingAforo;
  }

  openEstaSemanaTab() {
    this.miServicio.isCheckingEstaSemana = true;
  }

  openHistorialTab(){
    this.miServicio.isCheckingHistorial = true;
  }

}
