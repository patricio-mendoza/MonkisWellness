import { Component } from '@angular/core';
import { CompartidovarService } from '../compartidovar.service';
import { HomeComponent } from '../home.component';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
const API_URI = 'http://localhost:8888/api';

interface bloqueo {
  espacio: null;
  wellness: number;
  dia: number;
  horaI: string;
  horaF: string;
  repetible: number;
}
import { DatePipe, Time } from '@angular/common';


@Component({
  selector: 'app-cierres',
  templateUrl: './cierres.component.html',
  styleUrls: ['./cierres.component.scss']
})

export class CierresComponent extends HomeComponent {
  hora_inicio: string;
  hora_fin: string;
  form: FormGroup;
  diaSemana: string = "lunes";
  diaNumero(diaSemana: string): number {
    console.log(diaSemana)
    switch (diaSemana) {
      case "Lunes":
        return 2;
        break;
      case "Martes":
        return 3;
        break;
      case "Miércoles":
        return 4;
        break;
      case "Jueves":
        return 5;
        break;
      case "Viernes":
        return 6;
        break;
      case "Sábado":
        return 7;
        break;
      case "Domingo":
        return 1;
        break;
      default:
        return 0;
        break;

    }
  }

  datePipe = new DatePipe("en-US");

  estado: boolean;
  warning: boolean = false;
  reqData: any;

  // Se obtiene la hora actual
  hora: string = this.datePipe.transform(new Date(), 'HH:mm');

  ngOnInit() {
    // Se obtiene el estado del gimnasio
    this.getEstadoGym();
  }

  getEstadoGym() {
    let apiURL = `${API_URI}/gym/estado`;
    this.http.get(apiURL).subscribe(res => {
      this.reqData = res;
      this.estado = this.reqData.estado;
    });
  }

  // Función para registrar el cierre en la base de datos
  registrarCambio(): boolean {

    // Hora a la que se aplicó el cierre
    let ahora: string = this.datePipe.transform(new Date(), 'HH:mm')

    // Dependiendo del estado actual del gimnasio se define si es un cierre o una apertura
    let horaInicio: string = !this.estado ? this.hora : ahora;
    let horaFin: string = this.estado ? this.hora : ahora;

    // Validaciones para evitar que el usuario ponga un cierre o apertura sin final
    let horaIniNum = parseInt(horaInicio[0] + horaInicio[1] + horaInicio[3] + horaInicio[4]);
    let horaFinNum = parseInt(horaFin[0] + horaFin[1] + horaFin[3] + horaFin[4]);

    if (horaInicio == horaFin || (this.estado && horaFinNum < horaIniNum) || (!this.estado && horaFinNum > horaIniNum)) {
      this.warning = true;
      return false;
    }
    else {
      this.warning = false;
    }

    // Mensaje de confirmación del cambio manual
    let mensaje_confirmacion = "¿Seguro que desea " + (this.estado ? "cerrar" : "abrir") + " el gimnasio hasta las " + (this.estado ? horaFin : horaInicio) + "?"

    let confirmar = window.confirm(mensaje_confirmacion)
    if (!confirmar) {
      return false;
    }

    // Envió a la base de datos
    const headers = { 'Content-Type': 'application/json' };
    const options = { headers: headers };

    const body = {
      dia: new Date().getDay() == 7 ? 1 : new Date().getDay() + 1,
      hora_inicio: horaInicio,
      hora_fin: horaFin
    };


    this.http.post(`${API_URI}/gym/cambioManual`, JSON.stringify(body), options).subscribe();

    return true;
  }

  // Llamada a la API para abrir el gimnasio
  abrir() {
    if (this.registrarCambio()) {
      let apiURL = `${API_URI}/gym/estado/abrir`;
      this.http.put(apiURL, {}).subscribe();
      this.getEstadoGym();
      this.miServicio.cambiarEstado(this.estado);
      this.miServicio.isClosing = !this.miServicio.isClosing;
    }
  }

  // Llamada a la API para cerrar el gimnasio
  cerrar() {
    if (this.registrarCambio()) {
      let apiURL = `${API_URI}/gym/estado/cerrar`;
      this.http.put(apiURL, {}).subscribe();
      this.getEstadoGym();
      this.miServicio.cambiarEstado(this.estado);
      this.miServicio.isClosing = !this.miServicio.isClosing;
    }
  }

  bloquear(): void {
    const horaInicio = this.hora_inicio;
    const horaFin = this.hora_fin;

    const headers = { 'Content-Type': 'application/json' };
    const options = { headers: headers };

    const body = {
      id_espacio: null,
      id_wellness: 1,
      dia: this.diaNumero(this.diaSemana),
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      repetible: 1,
    };

    console.log(body);
    this.http.post(`${API_URI}/bloqueo/`, JSON.stringify(body), options).subscribe();

    this.miServicio.isClosing = !this.miServicio.isClosing;
  }
}
