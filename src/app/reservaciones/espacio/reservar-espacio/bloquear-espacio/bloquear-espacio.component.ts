import { Component } from '@angular/core';
import { ReservarEspacioComponent } from '../reservar-espacio.component';
import { OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';

@Component({
  selector: 'app-bloquear-espacio',
  templateUrl: './bloquear-espacio.component.html',
  styleUrls: ['./bloquear-espacio.component.scss']
})

export class BloquearEspacioComponent extends ReservarEspacioComponent implements OnInit {
  fechaInicio: Date | null;
  fechaFinal: Date | null;
  horaFin: string;
  horaIni: string;
  hoy = new Date();  

  liberar(id:number){
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json');
    const options = { headers: headers };

    this.http.put(`${API_URI}/reservaciones/liberar_espacio/${id}`,[], options).subscribe()

    confirm("Está seguro de que desea liberar este espacio?")

    this.getBloqueos();
  }

  notificarAlumnos(fechaInicio: string, fechaFin: string) {
    let reservasACancelar: any[] = [];

    let token = localStorage.getItem('token');
        const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json');
    const options = { headers: headers };

    this.http.get(`${API_URI}/reservaciones/bloqueadas/${this.id_espacio}/${fechaInicio}/${fechaFin}`,options).subscribe(res => {
      this.reqData = res;
      reservasACancelar = this.reqData.data;

      for(let i = 0; i < reservasACancelar.length; i++){
        const body = {
          matricula: reservasACancelar[i].matricula,
          encabezado: 'Reservacion Cancelada',
          texto: `Tu reservación en la ${this.nombreEspacio} en el ${this.nombreInstalacion} ha sido cancelada por un administrador debido a un bloqueo de la instalación.`,
          id_reservacion: reservasACancelar[i].id_reservacion
        };
  
        this.http.post(`${API_URI}/generar/aviso`, JSON.stringify(body), options).subscribe();
  
      }

    });
    this.getBloqueos();
  }

  bloquear() {
    confirm("Está seguro de que desea aplicar este bloqueo?")

    let rango = (this.fechaFinal.getTime() - this.fechaInicio.getTime()) / (1000 * 60 * 60 * 24)

    let fechaIni = this.fechaInicio.getDate();
    let fechaAuxIni = new Date(this.fechaInicio);
    let fechaAuxFin = new Date(this.fechaInicio);

    for (let index = 0; index <= rango; index++) {
      fechaAuxIni.setDate(fechaIni + index);

      fechaAuxIni.setHours(parseInt(this.horaIni.substring(0, 2)));
      fechaAuxIni.setMinutes(parseInt(this.horaIni.substring(3, 5)));

      fechaAuxFin.setDate(fechaIni + index);

      fechaAuxFin.setHours(parseInt(this.horaFin.substring(0, 2)));
      fechaAuxFin.setMinutes(parseInt(this.horaFin.substring(3, 5)));

      let fechaIniForm = this.datepipe.transform(fechaAuxIni, 'yyyy-MM-dd HH:mm:ss');
      let fechaFinForm = this.datepipe.transform(fechaAuxFin, 'yyyy-MM-dd HH:mm:ss');

      let diaSemana = fechaAuxIni.getDay() == 0 ? 7 : fechaAuxIni.getDay();

      let token = localStorage.getItem('token');
      const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
      const options = { headers: headers };
      const body = {
        dia: diaSemana,
        hora_inicio: this.horaIni,
        hora_fin: this.horaFin,
        fechaInicio: fechaIniForm,
        fechaFinal: fechaFinForm
      }

      this.http.post(`${API_URI}/bloquea/${this.id_espacio}`, JSON.stringify(body), options).subscribe();
      this.notificarAlumnos(fechaIniForm, fechaFinForm);
    }

  }
}
