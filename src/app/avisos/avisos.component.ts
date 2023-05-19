import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';

// Estructura de un aviso a llenar
interface Aviso {
  id_anuncio: number,
  matricula: string,
  encabezado: string,
  texto: string,
  tiempo: string,
  tituloNotif: string,
}

@Component({
  selector: 'app-avisos',
  templateUrl: './avisos.component.html',
  styleUrls: ['./avisos.component.scss']
})
export class AvisosComponent implements OnInit {
  anuncios = [
    {
      id_anuncio: 1,
      tiempoReserva: "18:00 - 19:30",
      tiempoNotif: "17:48",
      textoAnuncio: "Tu reservación del Lunes 17 de abril 18:00 - 19:00 en Campo F",
      tituloNofif: "Reservacion Confirmada",
      cancha: "Campo Tenis 1 | CDB1",
      fechaNotif: "17/02/2023", 
    },
    {
      id_anuncio: 2,
      tiempoReserva: "18:00 - 19:00",
      tiempoNotif: "13:55",
      textoAnuncio: "Tu reservación del Lunes 17 de abril 18:00 - 19:00 en Campo Fútbol Americano 1 | CDB 1 ha sido cancelada debido a: *justificación de cancelación por evento*",
      tituloNofif: "Reservación Cancelada",
      cancha: "Campo Tenis 1 | CDB1",
      fechaNotif: "17/02/2023", 
    }];

  reqData: any;

  constructor(private http: HttpClient) { }

  // Al cargar la página obtiene todos los avisos
  ngOnInit() {
    this.getAnuncios();
  }

  getAnuncios(): void {
    let id = localStorage.getItem("id")
    let apiURL = `${API_URI}/avisos/${id}`;
    console.log(apiURL)
    this.http.get(apiURL).subscribe(res => {
      this.reqData = res;
      this.anuncios = this.reqData.data;
      console.log(this.anuncios)
    });
  }

  tituloCancelada: "¡Reservación Cancelada!";
  tituloGuardada: "¡Reservación Guardada!";
}
