import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';

interface Aviso {
  id_anuncio: number,
  tiempoReserva: string,
  tiempoNotif: string,
  textoAnuncio: string,
  tituloNofif: string,
  cancha: string,
  fechaNotif: string,
}

@Component({
  selector: 'app-avisos',
  templateUrl: './avisos.component.html',
  styleUrls: ['./avisos.component.scss']
})
export class AvisosComponent implements OnInit {
  anuncios: Aviso[];

  reqData: any;

  constructor(private http: HttpClient) { }

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
