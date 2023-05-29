import { Component } from '@angular/core';
import { CompartidovarService } from '../compartidovar.service';
import { HomeComponent } from '../home.component';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
const API_URI = 'http://localhost:8888/api';

interface bloqueo {
  id_bloqueo: number;
  dia: number;
  hora_inicio: string;
  hora_fin: string;
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
  diaSemana: number = 0;
  diaSemanaM: number = 0;
  cierres: bloqueo[];
  cierresByDay: bloqueo[];
  cierre_act: number = -1;
  editarIni: string;
  editarFin: string;
  valCierre: boolean;

  datePipe = new DatePipe("en-US");

  estado: boolean;
  warning: boolean = false;
  reqData: any;

  // Se obtiene la hora actual
  hora: string = this.datePipe.transform(new Date(), 'HH:mm');

  ngOnInit() {
    // Se obtiene el estado del gimnasio
    this.getEstadoGym();
    this.getCierres();
  }

  getEstadoGym() {
    let apiURL = `${API_URI}/gym/estado`;
    this.http.get(apiURL).subscribe(res => {
      this.reqData = res;
      this.estado = this.reqData.estado;
    });
  }

  cancelarCierresM() {
    let apiURL = `${API_URI}/gym/cancelarCierresM`
    this.http.put(apiURL, "").subscribe();
  }

  // Función para registrar el cierre en la base de datos
  registrarCambio(): boolean {

    this.cancelarCierresM();

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

  reiniciarInputP() {
    this.cierre_act = null;
    this.editarFin = "";
    this.editarIni = "";

    alert("Cierre programado exitosamente");
    this.getCierres();
    this.generarLista();

    this.diaSemanaM = 0;
  }

  bloquear(): void {
    const horaInicio = this.hora_inicio;
    const horaFin = this.hora_fin;

    let confirmar = window.confirm("¿Deseas programar el cierre de " + horaInicio + " a " + horaFin + "?")
    if (confirmar) {
      const headers = { 'Content-Type': 'application/json' };
      const options = { headers: headers };

      const body = {
        id_espacio: null,
        id_wellness: 1,
        dia: this.diaSemana,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        repetible: 1,
      };

      this.http.post(`${API_URI}/bloqueo/`, JSON.stringify(body), options).subscribe();

      this.reiniciarInputP();
      this.miServicio.cambiarEstado(true);
    }
  }

  getCierres() {
    let apiURL = `${API_URI}/gym/cierresR`;

    this.http.get(apiURL).subscribe(res => {
      this.reqData = res;
      this.cierres = this.reqData.data;
    });

  }

  generarLista() {

    this.cierre_act = -1;
    this.cierresByDay = [];

    for (let cierre of this.cierres) {
      if (cierre.dia == this.diaSemanaM) {
        this.cierresByDay.push(cierre);
      }
    }
  }

  findCierre(cierre_act: number): bloqueo {

    for (let cierre of this.cierresByDay) {
      if (cierre.id_bloqueo == cierre_act) {
        return cierre;
      }
    }

    return this.cierresByDay[0];

  }

  obtenerCierre() {

    this.editarFin = "";
    this.editarIni = "";

    let cierre_actual = this.findCierre(this.cierre_act)

    this.editarFin = cierre_actual.hora_fin;
    this.editarIni = cierre_actual.hora_inicio;

  }

  wait(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  reiniciarInput() {
    this.cierre_act = -1;
    this.editarFin = "";
    this.editarIni = "";

    alert("Cierre eliminado exitosamente");
    this.getCierres();
    this.generarLista();
    this.miServicio.cambiarEstado(true);

    this.diaSemanaM = 0;
  }

  borrarCierre() {

    if (this.diaSemanaM == 0 || this.cierre_act == -1) {
      this.valCierre = true;
    }
    else {
      this.valCierre = false;
      let confirmar = window.confirm("¿Deseas eliminar este cierre?")

      const headers = { 'Content-Type': 'application/json' };
      const options = { headers: headers };

      const body = {
        id_bloqueo: this.cierre_act
      };

      this.http.put(`${API_URI}/gym/borrar`, JSON.stringify(body), options).subscribe();
      this.reiniciarInput();
    }
  }


}
