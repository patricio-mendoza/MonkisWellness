import { Component } from '@angular/core';
import { API_URI } from '../../../../server/server.js';
import { HomeComponent } from '../home.component';
import { DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';

@Component({
  selector: 'app-estado-gym',
  templateUrl: './estado-gym.component.html',
  styleUrls: ['./estado-gym.component.scss']
})

export class EstadoGymComponent extends HomeComponent {

  intervalId;
  intervaloAforo;
  datePipe = new DatePipe('en-Us');

  administrador:string;
  estado: boolean;
  hora_apertura: string = "3:00 pm";
  hora_cierre: string = "10:00 pm"

  aforo_max: number = 280;
  aforo_actual: number = 0;

  reqData: any;

  ngOnInit() {
    this.getEstadoGym();
    this.getAforo();
    this.getHoraA();
    this.getHoraC();
    this.administrador = localStorage.getItem('isAdmin');

    this.intervalId = setInterval(()=>{
      this.time = new Date();
    }, 1000);
    
    this.intervaloAforo = setInterval(() =>{
      this.getAforo();
    }, 600000)

    // Define el estado del servicio como el que está en la base de datos
    this.miServicio.cambiarEstado(this.estado);

    // Detecta cuando cambia el estado en la base de datos y ajusta los valores necesarios
    this.miServicio.estado$.subscribe((value:boolean) => {
      this.getEstadoGym();
      this.getHoraA();
      this.getHoraC();
      this.getAforo();
    });
  }

  ngOnDestroy(){
    clearInterval(this.intervalId);
  }
  
  getEstadoGym() {
    let apiURL = `${API_URI}/gym/estado`;
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(apiURL, {headers}).subscribe(res => {
      this.reqData = res;
      this.estado = this.reqData.estado;
    });
  }
  getAforo() {
    let apiURL = `${API_URI}/gym/aforo`;
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(apiURL, {headers}).subscribe(res => {
      this.reqData = res;
      this.aforo_max = this.reqData.data.aforo_max;
      this.aforo_actual = this.reqData.data.aforo_actual;
    });
  }
  getHoraA() {
    let apiURL = `${API_URI}/gym/siguienteAp`;
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(apiURL, {headers}).subscribe(res => {
      this.reqData = res;
      if (this.reqData.data[0]) { 
        this.hora_apertura = this.reqData.data[0].hora_fin;
        this.hora_apertura = this.hora_apertura.substring(0,5);
      }
    });
  }
  
  getHoraC() {
    let apiURL = `${API_URI}/gym/siguienteCi`;
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(apiURL, {headers}).subscribe(res => {
      this.reqData = res;
      if (this.reqData.data[0]) { 
        this.hora_cierre = this.reqData.data[0].hora_inicio;
        this.hora_cierre = this.hora_cierre.substring(0,5);
      }
    });
  }
}
