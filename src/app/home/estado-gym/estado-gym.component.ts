import { Component } from '@angular/core';
import { API_URI } from '../../../../server/server.js'
import { HomeComponent } from '../home.component';

const API_URI = 'http://localhost:8888/api';

@Component({
  selector: 'app-estado-gym',
  templateUrl: './estado-gym.component.html',
  styleUrls: ['./estado-gym.component.scss']
})

export class EstadoGymComponent extends HomeComponent {
  intervalId;
  
  administrador:string;
  estado: boolean;
  razon: string = "Mantenimiento";
  hora_cambio: string = "3:00 pm";

  aforo_max: number = 280;
  aforo_actual: number = 0;




  override ngOnInit() {
    this.getEstadoGym();
    this.getAforo();
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
  getAforo() {
    let apiURL = `${API_URI}/gym/aforo`;
    this.http.get(apiURL).subscribe(res => {
      this.reqData = res;
      this.aforo_max = this.reqData.data.aforo_max;
      this.aforo_actual = this.reqData.data.aforo_actual;
    });
  }
}
