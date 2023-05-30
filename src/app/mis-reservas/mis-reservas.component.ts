import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';

interface Reserva {
  id_reservacion: number;
  nombre_espacio: string;
  hora_entrada: Date;
  hora_salida: Date;
  nombre_deporte: string;
  nombre_instalacion: string;
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

    // estado de reserva = 4
    let index = this.reservaciones.indexOf(reserva);
    this.reservaciones[index].estatus = 0;

    this.http.put(`${API_URI}/reserva/enprogreso/${reserva.id_reservacion}`, {}).subscribe()
    
  }
  cancelar(reserva: Reserva){
    let index = this.reservaciones.indexOf(reserva);
    if (this.reservaciones[index].estatus != 1) {
      alert ("Solo puedes cancelar reservaciones activas.");
      return;
    }

    let wantsToDelete = confirm('¿Seguro que quieres cancelar esta reservación?')
    if(!wantsToDelete) { return; }

    alert ("Reservacion Cancelada.")

    let apiURL = `${API_URI}/cancelar/mireserva/${reserva.id_reservacion}`
    
    const headers = { 'Content-Type': 'application/json' };
    const options = { headers: headers };
    const body = {
      matricula: localStorage.getItem('id'),
      encabezado: 'Reservacion Cancelada',
      texto: `Has cancelado tu reservacion de la ${reserva.nombre_espacio} a las ${reserva.hora_entrada}.`,
      id_reservacion: reserva.id_reservacion
    };
    this.reservaciones[index].estatus = 3;

    this.http.put(apiURL, JSON.stringify(body)).subscribe();
    this.http.post(`${API_URI}/generar/aviso`, JSON.stringify(body), options).subscribe();
  }

  cancelarPorNoConfirmar(reserva: Reserva) {
    let index = this.reservaciones.indexOf(reserva);
    this.reservaciones[index].estatus = 3;

    const headers = { 'Content-Type': 'application/json' };
    const options = { headers: headers };
    const body = {
      matricula: localStorage.getItem('id'),
      encabezado: 'Reservacion Cancelada',
      texto: `Tu reservación de la ${reserva.nombre_espacio} a las ${reserva.hora_entrada} ha sido cancelada por no confirmar la llegada al espacio.`,
      id_reservacion: reserva.id_reservacion
    };

    let apiURL = `${API_URI}/cancelar/mireserva/${reserva.id_reservacion}`
    this.http.put(apiURL, {}).subscribe();
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
    
    if (reserva.estatus === 1 && now.getTime() > prorrogaTimeLimit.getTime()) {this.cancelarPorNoConfirmar(reserva)}

    return now > new Date(reserva.hora_entrada) && now.getTime() < prorrogaTimeLimit.getTime();
  }

  isReservacionEnProgreso(reserva: Reserva): boolean {
    let now = new Date();
    return now > new Date(reserva.hora_entrada) && now < new Date(reserva.hora_salida);
  }

  getProrroga(hora: Date) {
    let horaDate = new Date(hora)
    return `${horaDate.getHours()}:${horaDate.getMinutes() + this.prorroga}`;
  }
}
