import { Component } from '@angular/core';
import { HomeComponent } from '../../home.component';
import { AfterViewInit } from '@angular/core';
import { Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';

interface Registro{
  aforo:number;
  tiempo:string;
  dia:string;
}

@Component({
  selector: 'app-historial-pop-up',
  templateUrl: './historial-pop-up.component.html',
  styleUrls: ['./historial-pop-up.component.scss']
})
export class HistorialPopUpComponent extends HomeComponent {
  datos:Registro[];
  
  diaActual:number = 0;
  historialDia:number = 0;

  isInFechaActual:boolean = true;
  isDomingo:boolean = false;

  dias:string[] = ["Domingo", "Lunes", "Martes", "Miércoles","Jueves", "Viernes", "Sábado"]
  mapAforo:number[];
  reqData:any;

  cambiarDia(offset: number) {
    const totalDias = this.dias.length;
    this.historialDia = (this.historialDia + offset + totalDias) % totalDias;

    this.isInFechaActual = (this.historialDia == this.diaActual) ? true : false;
    this.isDomingo = (this.historialDia == 0) ? true : false;

    this.getDatosHistorial(this.diaActual-this.historialDia);

  } 
  
  ngOnInit(){
    this.historialDia = new Date().getDay()
    this.diaActual = this.historialDia;
    this.isDomingo = (this.historialDia == 0) ? true : false;
    this.getDatosHistorial(this.diaActual-this.historialDia)
  }
  
  closeEstaSemanaTab() {
    this.miServicio.isCheckingHistorial = false;
  }

  getDatosHistorial(diaSeleccionado:number) {
    let fecha = new Date();
    fecha.setDate(fecha.getDate() - diaSeleccionado)
    var offset = -(new Date().getTimezoneOffset() / 60);
    fecha.setHours(fecha.getHours() + offset - 6); // Restar 6 horas al ajustar la hora local
    let fechastr = fecha.toISOString().slice(0, 19).replace('T', ' ');
      
    let token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`) 

    let apiURL = `${API_URI}/gym/historial/${fechastr}`;

    this.http.get(apiURL, {headers}).subscribe(res => {
      this.reqData = res;
      this.datos = this.reqData.data;
      this.mapAforo = this.datos.map(x => x.aforo)
    });
  }
}
