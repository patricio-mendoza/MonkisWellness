import { Component } from '@angular/core';
import { ReservarEspacioComponent } from '../reservar-espacio.component';

@Component({
  selector: 'app-bloquear-espacio',
  templateUrl: './bloquear-espacio.component.html',
  styleUrls: ['./bloquear-espacio.component.scss']
})
export class BloquearEspacioComponent extends ReservarEspacioComponent {
  fechaInicio: Date|null;
  fechaFinal: Date|null;
  horaFin: string;
  horaIni: string;

  bloquear(){ 

    // for (let index = 0; index < (this.fechaFinal.getTime()-this.fechaInicio.getTime())/(1000*60*60*24); index++) {
      
      
    // }

    console.log(this.id_espacio)
  }
}
