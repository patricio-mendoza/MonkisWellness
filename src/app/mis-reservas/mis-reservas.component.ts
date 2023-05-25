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
    let wantsToDelete = confirm('¿Seguro que quieres borrar esta reservación?')
    alert ( wantsToDelete );
    if(!wantsToDelete) { return; }

    let apiURL = `${API_URI}/cancelar/mireserva/${reserva.id_reservacion}`

    // borrar del array local
    let index = this.reservaciones.indexOf(reserva);
    this.reservaciones.splice(index, 1);
    // borrar de la base de datos
    this.http.delete(apiURL).subscribe();
    
    const body = {
      matricula: localStorage.getItem('id'),
      encabezado: 'Reservacion Cancelada',
      texto: `Has cancelado tu reservacion de las ${reserva.hora_entrada}.`,
      id_reservacion: reserva.id_reservacion
    };
    this.http.post(`${API_URI}/generar/aviso`, JSON.stringify(body), options).subscribe();
    }

  backgroundURL(nombre_deporte: string): string {
    let img_url = nombre_deporte.toLocaleLowerCase();
    img_url = img_url.replaceAll(' ', '_') + '.jpeg';
    img_url = '../../assets/foto_deporte/' + img_url;

    return img_url; 
  }

  isProrrogaActiva(reserva: Reserva): boolean {
    let now = new Date();
    let prorrogaTimeLimit = new Date(reserva.hora_entrada);
    prorrogaTimeLimit.setMinutes(prorrogaTimeLimit.getMinutes() + this.prorroga);
    
    return now > new Date(reserva.hora_entrada) && now.getTime() < prorrogaTimeLimit.getTime();
  }
}
