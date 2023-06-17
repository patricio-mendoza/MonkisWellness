// cierres.component.ts
// Funciones de la tarjeta de cierres
// Daniel Evaristo Escalera Bonilla
// 15/05/2023

import { Component } from '@angular/core';
import { CompartidovarService } from '../compartidorvar-service/compartidovar.service';
import { HomeComponent } from '../home.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
const API_URI = 'http://localhost:8888/api';

interface Bloqueo {
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
  diaSemana: number[] = [];
  diaSemanaM: number = 0;
  cierres: Bloqueo[];
  cierresByDay: Bloqueo[];
  cierre_act: number = -1;
  editarIni: string;
  editarFin: string;
  valCierre1: boolean;
  valCierre2: boolean;

  valProg1: boolean = false;
  valProg2: boolean = false;
  valProg3: boolean = false;


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

  // Obtiene el estado del gimnasio de la base de datos
  getEstadoGym() {
    let apiURL = `${API_URI}/gym/estado`;
    let token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(apiURL, {headers}).subscribe(res => {
      this.reqData = res;
      this.estado = this.reqData.estado;
    });
  }

  // Elimina los cierres manuales obsoletos
  cancelarCierresM() {
    let apiURL = `${API_URI}/gym/cancelarCierresM`;
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json');
    const options = { headers: headers };

    this.http.put(apiURL, [], options).subscribe();
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
    
    this.cancelarCierresM();

    // Envió a la base de datos
    let token = localStorage.getItem('token')
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

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
      let token = localStorage.getItem('token');
    const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json');
    const options = { headers: headers };

      this.http.put(apiURL, [], options).subscribe();
      this.getEstadoGym();
      this.miServicio.cambiarEstado(this.estado);
      this.miServicio.isClosing = !this.miServicio.isClosing;
    }
  }

  // Llamada a la API para cerrar el gimnasio
  cerrar() {
    if (this.registrarCambio()) {
      let apiURL = `${API_URI}/gym/estado/cerrar`;
      let token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.put(apiURL, {headers}).subscribe();
      this.getEstadoGym();
      this.miServicio.cambiarEstado(this.estado);
      this.miServicio.isClosing = !this.miServicio.isClosing;
    }
  }

  // Reinicia los inputs de la sección programar cierre
  reiniciarInputP() {
    this.cierre_act = null;
    this.editarFin = "";
    this.editarIni = "";

    alert("Cierre programado exitosamente");
    this.getCierres();
    this.generarLista();

    this.diaSemanaM = 0;
  }

  // Selecionar el día en la checkbox
  toggleDay(day: number): void {
    if (this.diaSemana.includes(day)) {
      this.diaSemana = this.diaSemana.filter(d => d !== day);
    } else {
      this.diaSemana.push(day);
    }
  }

  // Programar un cierre
  bloquear(): void {
    this.valProg1 = false;
    this.valProg2 = false;
    this.valProg3 = false;
    const horaInicio = this.hora_inicio;
    const horaFin = this.hora_fin;

    if (this.diaSemana.length != 0 && this.hora_inicio != null && this.hora_fin != null) {
      let confirmar = window.confirm("¿Deseas programar el cierre de " + horaInicio + " a " + horaFin + "?")
      if (confirmar) {
        for (let d of this.diaSemana) {
          let token = localStorage.getItem('token')
          const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json');

          const options = { headers: headers };

          const body = {
            id_espacio: null,
            id_wellness: 1,
            dia: d,
            hora_inicio: horaInicio,
            hora_fin: horaFin,
            repetible: 1,
          };

          this.http.post(`${API_URI}/bloqueo/`, JSON.stringify(body), options).subscribe();
        }

        this.reiniciarInputP();
        this.miServicio.cambiarEstado(true);
      }
    }
    else {
      // Validación de campos
      if (this.diaSemana.length == 0) this.valProg1 = true;
      else this.valProg1 = false;
      if (this.hora_inicio == null) this.valProg2 = true;
      else this.valProg2 = false;
      if (this.hora_fin == null) this.valProg3 = true;
      else this.valProg3 = false;
    }
  }
  
  // Obtener los cierres programados
  getCierres() {
    let apiURL = `${API_URI}/gym/cierresR`;
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(apiURL, {headers}).subscribe(res => {
      this.reqData = res;
      this.cierres = this.reqData.data;
    });

  }
  
  // Generar una lista de cierres programados por día
  generarLista() {

    this.cierre_act = -1;
    this.cierresByDay = [];

    for (let cierre of this.cierres) {
      if (cierre.dia == this.diaSemanaM) {
        this.cierresByDay.push(cierre);
      }
    }
  }

  // Obtener un cierre en específico
  findCierre(cierre_act: number): Bloqueo {

    for (let cierre of this.cierresByDay) {
      if (cierre.id_bloqueo == cierre_act) {
        return cierre;
      }
    }

    return this.cierresByDay[0];

  }
  
  // Mostrar cierre seleccionado
  mostrarCierre() {
    this.editarFin = "";
    this.editarIni = "";

    let cierre_actual = this.findCierre(this.cierre_act)

    this.editarFin = cierre_actual.hora_fin;
    this.editarIni = cierre_actual.hora_inicio;

  }
  
  // Reiniciar input de eliminación de cierres
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
  
  // Eliminar un cierre programado seleccionado
  borrarCierre() {

    if (this.diaSemanaM == 0 || this.cierre_act == -1) {
      if (this.diaSemanaM == 0) this.valCierre1 = true;
      else this.valCierre1 = false;
      if (this.cierre_act == -1) this.valCierre2 = true;
      else this.valCierre2 = false;
    }
    else {
      this.valCierre1 = false;
      this.valCierre2 = false;
      let confirmar = window.confirm("¿Deseas eliminar este cierre?")
      
      let token = localStorage.getItem('token')
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json');

      const options = { headers: headers };

      const body = {
        id_bloqueo: this.cierre_act
      };

      this.http.put(`${API_URI}/gym/borrar`, JSON.stringify(body), options).subscribe();
      this.reiniciarInput();
    }
  }

  
}
