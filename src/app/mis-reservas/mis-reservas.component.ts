import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';

interface Reserva {
  //matricula?: string;
  //num_nomina?: string;
  //id_espacio: number;
  id_reservacion: number;
  nombre_espacio: string;
  hora_entrada: Date;
  hora_salida: Date;
  nombre_deporte: string;
  nombre_instalacion: string;
  //prioridad: number;
  estatus: number;
}

@Component({
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.scss']
})
export class MisReservasComponent implements OnInit {
  reservaciones: Reserva[] = [];
  reqData: any;

  prorroga = 20 // 20 minutos para confirmar

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getReservas();
  }

  getReservas(): void {
    let id = localStorage.getItem("id")
    let apiURL = `${API_URI}/user/reservaciones/${id}`;
    this.http.get(apiURL).subscribe(res => {
      this.reqData = res;
      this.reservaciones = this.reqData.data;
    });

    
  }
  
  confirmar(reserva: Reserva){
    if (!this.isProrrogaActiva(reserva)) {return;}
    
  }
  cancelar(reserva: Reserva){
    let index = this.reservaciones.indexOf(reserva);
    if (this.reservaciones[index].estatus === 3 ) {
      alert ("Esta reservacion ya está cancelada");
      return;
    }

    let wantsToDelete = confirm('¿Seguro que quieres cancelar esta reservación?')
    if(!wantsToDelete) { return; }

    alert ("Reservacion Cancelada")

    let apiURL = `${API_URI}/cancelar/mireserva/${reserva.id_reservacion}`
    
    const headers = { 'Content-Type': 'application/json' };
    const options = { headers: headers };
    const body = {
      matricula: localStorage.getItem('id'),
      encabezado: 'Reservacion Cancelada',
      texto: `Has cancelado tu reservacion de las ${reserva.hora_entrada}.`,
      id_reservacion: reserva.id_reservacion
    };
    this.reservaciones[index].estatus = 3;

    this.http.put(apiURL, JSON.stringify(body)).subscribe();
    this.http.post(`${API_URI}/generar/aviso`, JSON.stringify(body), options).subscribe();
  }

  backgroundURL(nombre_deporte: string): string {
    let img_url = nombre_deporte.toLocaleLowerCase();
    img_url = img_url.replaceAll(' ', '_') + '.jpeg';
    img_url = '../../assets/foto_deporte/' + img_url;

    return img_url; 
  }

  isProrrogaActiva(reserva: Reserva): boolean {
    if (reserva.estatus !== 1) {return false;}

    let now = new Date();
    let prorrogaTimeLimit = new Date(reserva.hora_entrada);
    prorrogaTimeLimit.setMinutes(prorrogaTimeLimit.getMinutes() + this.prorroga);
    
    return now > new Date(reserva.hora_entrada) && now.getTime() < prorrogaTimeLimit.getTime();
  }

  getProrroga(hora: Date) {
    let horaDate = new Date(hora)
    return `${horaDate.getHours()}:${horaDate.getMinutes() + this.prorroga}`;
  }
}
