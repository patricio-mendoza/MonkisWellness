// mis-reservas.component.ts
// Lista de reservaciones
// César Miguel Camarillo Cepeda
// 27/04/2023
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  // Obtiene las reservas de la API
  getReservas(): void {
    let id = localStorage.getItem("id")
    let apiURL = `${API_URI}/user/reservaciones/${id}`;
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(apiURL, {headers}).subscribe(res => {
      this.reqData = res;
      this.reservaciones = this.reqData.data;
    });
  }
  
  // Botón confirmar para pasar el estado a en progreso
  confirmar(reserva: Reserva){
    if (!this.isProrrogaActiva(reserva)) {return;}

    // estado de reserva = 4
    let index = this.reservaciones.indexOf(reserva);
    this.reservaciones[index].estatus = 0;

    let token = localStorage.getItem('token')
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    const options = { headers: headers };

    this.http.put(`${API_URI}/reserva/enprogreso/${reserva.id_reservacion}`, [], options).subscribe()
    
  }

  // Pasar una reservación propia a confirmada
  cancelar(reserva: Reserva){
    let index = this.reservaciones.indexOf(reserva);
    if (this.reservaciones[index].estatus != 1) {
      alert ("Solo puedes cancelar reservaciones activas.");
      return;
    }

    let wantsToDelete = confirm('¿Seguro que quieres cancelar esta reservación?')
    if(!wantsToDelete) { return; }

    alert ("Reservacion Cancelada.")

    let token = localStorage.getItem('token')
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    const options = { headers: headers };
    const body = {
      matricula: localStorage.getItem('id'),
      encabezado: 'Reservacion Cancelada',
      texto: `Has cancelado tu reservacion de la ${reserva.nombre_espacio} a las ${reserva.hora_entrada}.`,
      id_reservacion: reserva.id_reservacion
    };

    this.reservaciones[index].estatus = 3;

    this.http.put(`${API_URI}/cancelar/mireserva/${reserva.id_reservacion}`, JSON.stringify(body), options).subscribe();
    this.http.post(`${API_URI}/generar/aviso`, JSON.stringify(body), options).subscribe();
  }

  // Manda el aviso de la cancelación por no confirmar la reservación
  cancelarPorNoConfirmar(reserva: Reserva) {
    let index = this.reservaciones.indexOf(reserva);
    this.reservaciones[index].estatus = 3;

    let token = localStorage.getItem('token')
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    const options = { headers: headers };
    const body = {
      matricula: localStorage.getItem('id'),
      encabezado: 'Reservacion Cancelada',
      texto: `Tu reservación de la ${reserva.nombre_espacio} a las ${reserva.hora_entrada} ha sido cancelada por no confirmar la llegada al espacio.`,
      id_reservacion: reserva.id_reservacion
    };

    let apiURL = `${API_URI}/cancelar/mireserva/${reserva.id_reservacion}`
    this.http.put(apiURL, [], options).subscribe();
    this.http.post(`${API_URI}/generar/aviso`, JSON.stringify(body), options).subscribe();
  }

  // Obtiene la foto del deporte
  backgroundURL(nombre_deporte: string): string {
    let img_url = nombre_deporte.toLocaleLowerCase();
    img_url = img_url.replaceAll(' ', '_') + '.jpeg';
    img_url = '../../assets/foto_deporte/' + img_url;

    return img_url; 
  }

  // Detecta si la prorroga de tiempo para los alumnos está activada
  isProrrogaActiva(reserva: Reserva): boolean {
    if (reserva.estatus !== 1) {return false;}

    let now = new Date();
    let prorrogaTimeLimit = new Date(reserva.hora_entrada);
    prorrogaTimeLimit.setMinutes(prorrogaTimeLimit.getMinutes() + this.prorroga);
    
    if (reserva.estatus === 1 && now.getTime() > prorrogaTimeLimit.getTime()) {this.cancelarPorNoConfirmar(reserva)}

    return now > new Date(reserva.hora_entrada) && now.getTime() < prorrogaTimeLimit.getTime();
  }

  // Determina si la reservación está en progreso
  isReservacionEnProgreso(reserva: Reserva): boolean {
    let now = new Date();
    return now > new Date(reserva.hora_entrada) && now < new Date(reserva.hora_salida);
  }

  // Define la prorroga
  getProrroga(hora: Date) {
    let horaDate = new Date(hora)
    return `${horaDate.getHours()}:${horaDate.getMinutes() + this.prorroga}`;
  }
}
