import { Component } from '@angular/core';
import { HomeComponent } from '../home.component';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
const API_URI = 'http://localhost:8888/api';

interface bloqueo {
  espacio: null;
  wellness: number;
  dia: number;
  horaI: string;
  horaF:string;
  repetible:number;
}

@Component({
  selector: 'app-cierres',
  templateUrl: './cierres.component.html',
  styleUrls: ['./cierres.component.scss']
})
export class CierresComponent extends HomeComponent{ 
  hora_inicio: string;
  hora_fin: string;
  form:FormGroup;
  diaSemana: string = "lunes";
  reqData: any;
  diaNumero(diaSemana:string):number{
    console.log(diaSemana)
    switch(diaSemana){
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
  bloquear(): void {
    const horaInicio = this.hora_inicio;
    const horaFin = this.hora_fin;
     

    const headers = { 'Content-Type': 'application/json' };
    const options = { headers: headers };
    
    const body = {
        id_espacio : null,
        id_wellness: 1,
        dia :this.diaNumero(this.diaSemana) ,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        repetible: 1,
    };

    console.log(body);
    this.http.post(`${API_URI}/bloqueo/`, JSON.stringify(body), options).subscribe();
}
}
