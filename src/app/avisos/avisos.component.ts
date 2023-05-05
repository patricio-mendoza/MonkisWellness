import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';

interface Aviso {
  id_anunacio: number,
  matricula: string,
  encabezado: string,
  texto: string,
  tiempo: string
  tituloNotif: string
}

@Component({
  selector: 'app-avisos',
  templateUrl: './avisos.component.html',
  styleUrls: ['./avisos.component.scss']
})
export class AvisosComponent implements OnInit {
  anuncios = [{
    id_anunacio: 1,
    matricula: "A",
    tiempo_reserva1: "15:00 - 16:00",
    tiempo_reserva2: "18:00 - 19:00",
    tiempo: "14:05",
    texto: "Tu reservación del Lunes 17 de abril 15:00 - 16:00 en Campo Fútbol 1 CDF1 ha sido correctamente guardada en “Mis reservaciones”",
    texto2: "Tu reservación del Lunes 17 de abril 15:00 - 16:00 en Campo Fútbol 1 CDF1 ha sido cancelada debido a: *justificación de cancelación por evento*",
    tituloNotif: "¡Reservación Guardada!",
    tituloNotif2: "¡Reservación Cancelada!",
    encabezado: "Campo Fútbol 1 | CDB1"
  } 
  /* {
    id_anunacio: 1,
    matricula: "A",
    tiempo_reserva1: "15:00 - 16:00",
    tiempo_reserva2: "18:00 - 19:00",
    tiempo2: "14:05",
    texto2: "Tu reservación del Lunes 17 de abril 15:00 - 16:00 en Campo Fútbol 1 CDF1 ha sido cancelada debido a: *justificación de cancelación por evento*",
    tituloNotif2: "¡Reservación Cancelada!",
    encabezado2: "Campo Tenis 1 | CDB1" 
  }*/]
  reqData: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    //this.getAnuncios();
  }

  getAnuncios(): void {
    let id = localStorage.getItem("id")
    let apiURL = `${API_URI}/avisos/${id}`;
    this.http.get(apiURL).subscribe(res => {
      this.reqData = res;
      this.anuncios = this.reqData.data;
    });
  }

  tituloCancelada: "¡Reservación Cancelada!";
  tituloGuardada: "¡Reservación Guardada!";
}
