import { Component } from '@angular/core';
import { CompartidovarService } from './compartidovar.service';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
const API_URI = 'http://localhost:8888/api';

interface registro{
  aforo:number;
  tiempo:string;
  dia:string;
}

const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  isAdmin = localStorage.getItem("isAdmin") === "true";
  newAforo: string;
  reqData:any;
  historial:registro[];
  time = new Date();
  dia: string = dias[this.time.getDay()];

  constructor(public location: Location, public http: HttpClient, public miServicio : CompartidovarService){}

  ngOnInit(){
    this.getDatosHistorial()
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

  openHistorialTab(){
    this.miServicio.isCheckingHistorial = true;
  }

  formatDateForLastWeek(): string {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // Resta 7 días en milisegundos
    
    lastWeek.setHours(lastWeek.getHours() - 6); // Restar 6 horas a la fecha de la semana anterior
  
    const year = lastWeek.getFullYear();
    const month = String(lastWeek.getMonth() + 1).padStart(2, '0');
    const day = String(lastWeek.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }


  getDatosHistorial() {
    let fecha = new Date();
    var offset = -(new Date().getTimezoneOffset() / 60);
    fecha.setHours(fecha.getHours() + offset - 6); // Restar 6 horas al ajustar la hora local
    let fechastr = fecha.toISOString().slice(0, 19).replace('T', ' ');
  
    let fecha_sem_ant = this.formatDateForLastWeek();
  
    let apiURL = `${API_URI}/gym/historial/${fechastr}/${fecha_sem_ant}`;
    this.http.get(apiURL).subscribe(res => {
      this.reqData = res;
      this.historial = this.reqData.data;
    });
  }



}
