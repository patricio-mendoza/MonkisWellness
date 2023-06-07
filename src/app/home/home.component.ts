import { Component } from '@angular/core';
import { CompartidovarService } from './compartidovar.service';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  constructor(public location: Location, public http: HttpClient, public miServicio : CompartidovarService){}

  ocultar(){
    this.miServicio.isModifyingAforo = !this.miServicio.isModifyingAforo;
  }

  cierresTab(){
    this.miServicio.isClosing = !this.miServicio.isClosing;
  }

  openEstaSemanaTab() {
    this.miServicio.isCheckingEstaSemana = true;
  }
}
