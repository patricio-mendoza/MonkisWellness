import { Component } from '@angular/core';
import { CompartidovarService } from '../compartidovar.service';
import { HomeComponent } from '../home.component';
import { DatePipe, Time } from '@angular/common';

const API_URI = 'http://localhost:8888/api';

@Component({
  selector: 'app-cierres',
  templateUrl: './cierres.component.html',
  styleUrls: ['./cierres.component.scss']
})

export class CierresComponent extends HomeComponent {


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
    let horaIniNum = parseInt(horaInicio[0]+horaInicio[1]+horaInicio[3]+horaInicio[4]);
    let horaFinNum = parseInt(horaFin[0]+horaFin[1]+horaFin[3]+horaFin[4]);

    if (horaInicio == horaFin || (this.estado && horaFinNum < horaIniNum) || (!this.estado && horaFinNum > horaIniNum)) {
      this.warning = true;
      return false;
    }
    else {
      this.warning = false;
    }
    
    // Mensaje de confirmación del cambio manual
    let mensaje_confirmacion = "¿Seguro que desea " + (this.estado ? "cerrar" : "abrir") + " el gimnasio hasta las " + (this.estado ? horaFin : horaInicio) +"?"

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

    console.log(this.hora);

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


}
