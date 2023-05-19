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
  reservaciones: Reserva[] = [{
    id_reservacion: 1,
    nombre_espacio : "Cancha Grande",
    hora_entrada: new Date(2023, 4, 17, 13, 0, 0, 0),
    hora_salida: new Date(2023, 4, 17, 14, 0, 0, 0),
    nombre_deporte: "Futbol",
    nombre_instalacion: "CDB1",
    estatus: 1
  },{
    id_reservacion: 2,
    nombre_espacio : "Cancha Grande",
    hora_entrada: new Date(2023, 4, 17, 15, 0, 0, 0),
    hora_salida: new Date(2023, 4, 17, 16, 0, 0, 0),
    nombre_deporte: "Volley de Playa",
    nombre_instalacion: "CDB1",
    estatus: 2
  },{
    id_reservacion: 3,
    nombre_espacio : "Cancha Fútbol Rápido",
    hora_entrada: new Date(2023, 4, 17, 13, 0, 0, 0),
    hora_salida: new Date(2023, 4, 17, 14, 0, 0, 0),
    nombre_deporte: "Basquetbol",
    nombre_instalacion: "CDB1",
    estatus: 3
  },{
    id_reservacion: 4,
    nombre_espacio : "Cancha Grande",
    hora_entrada: new Date(2023, 4, 17, 13, 0, 0, 0),
    hora_salida: new Date(2023, 4, 17, 14, 0, 0, 0),
    nombre_deporte: "Tenis",
    nombre_instalacion: "CDB1",
    estatus: 4
  },{
    id_reservacion: 5,
    nombre_espacio : "Cancha Grande",
    hora_entrada: new Date(2023, 4, 17, 13, 0, 0, 0),
    hora_salida: new Date(2023, 4, 17, 14, 0, 0, 0),
    nombre_deporte: "Futbol 7",
    nombre_instalacion: "CDB1",
    estatus: 5
  }];
  reqData: any;

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
  confirmar(){
    console.log("A");
  }
  cancelar(){
    console.log("B");
  }

  backgroundURL(nombre_deporte: string): string {
    let img_url = nombre_deporte.toLocaleLowerCase();
    img_url = img_url.replaceAll(' ', '_') + '.jpeg';
    img_url = '../../assets/foto_deporte/' + img_url;

    return img_url; 
  }
}
