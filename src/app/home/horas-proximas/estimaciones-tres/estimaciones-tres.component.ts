import { Component } from '@angular/core';

@Component({
  selector: 'app-estimaciones-tres',
  templateUrl: './estimaciones-tres.component.html',
  styleUrls: ['./estimaciones-tres.component.scss']
})
export class EstimacionesTresComponent {
  currentDateTime: number = Date.now();
  aforo_max = 280;
  num_personas = 228;
  porcentaje = this.num_personas < this.aforo_max ? (this.num_personas * 100 / this.aforo_max) : 100;
  porcentaje_redondeado = this.porcentaje.toPrecision(2);
  porcentaje_actual = this.porcentaje === 100 ? "100%" : this.porcentaje_redondeado.toString() + "%";
  signo_porciento = "%";
}
