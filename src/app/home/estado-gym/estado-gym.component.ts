import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URI } from '../../../../server/server.js'

const API_URI = 'http://localhost:8888/api';
const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

@Component({
  selector: 'app-estado-gym',
  templateUrl: './estado-gym.component.html',
  styleUrls: ['./estado-gym.component.scss']
})

export class EstadoGymComponent {
  time = new Date();
  dia: string = dias[this.time.getDay()];
  intervalId;
  
  administrador:string;
  estado: boolean;
  razon: string = "Mantenimiento";
  hora_cambio: string = "3:00 pm";

  reqData: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getEstadoGym();
    this.administrador = localStorage.getItem('isAdmin');

    this.intervalId = setInterval(()=>{
      this.time = new Date();
    }, 1000);
  }

  ngOnDestroy(){
    clearInterval(this.intervalId);
  }

  getEstadoGym() {
    let apiURL = `${API_URI}/gym/estado`;
    this.http.get(apiURL).subscribe(res => {
      this.reqData = res;
      this.estado = this.reqData.estado;
    });
  }
}
