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
    tiempoReserva: "15:00 - 16:00",
    tiempoNotif: "14:05",
    textoAnuncio: "Tu reservación del Lunes 17 de abril 15:00 - 16:00 en Campo Fútbol Americano 1 | CDB 1 ha sido correctamente guardada en “Mis reservaciones”",
    //texto2: "Tu reservación del Lunes 17 de abril 18:00 - 19:00 en Campo Fútbol Americano 1 | CDB 1 ha sido cancelada debido a: *justificación de cancelación por evento*",
    //texto3: "Tu reservación del Lunes 17 de abril 18:00 - 19:00 en Campo Tenis 1 | CDB 1 ha sido correctamente guardada en “Mis reservaciones”",
    tituloNotif: "Reservación Guardada",
    //tituloNotif2: "¡Reservación Cancelada!",
    cancha: "Campo Fútbol Americano 1 | CDB1",
    fechaNotif: "16/02/2023",
  } ,{
    id_anunacio: 2,
    tiempoReserva: "18:00 - 19:00",
    tiempoNotif: "13:55",
    textoAnuncio: "Tu reservación del Lunes 17 de abril 18:00 - 19:00 en Campo Fútbol Americano 1 | CDB 1 ha sido cancelada debido a: *justificación de cancelación por evento*",
    //texto2: "Tu reservación del Lunes 17 de abril 18:00 - 19:00 en Campo Fútbol Americano 1 | CDB 1 ha sido cancelada debido a: *justificación de cancelación por evento*",
    //texto3: "Tu reservación del Lunes 17 de abril 18:00 - 19:00 en Campo Tenis 1 | CDB 1 ha sido correctamente guardada en “Mis reservaciones”",
    tituloNotif: "Reservación Cancelada",
    //tituloNotif2: "¡Reservación Cancelada!",
    cancha: "Campo Tenis 1 | CDB1",
    fechaNotif: "17/02/2023", 
  }]
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
