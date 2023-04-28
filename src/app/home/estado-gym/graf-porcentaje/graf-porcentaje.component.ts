import { Component } from '@angular/core';

@Component({
  selector: 'app-graf-porcentaje',
  templateUrl: './graf-porcentaje.component.html',
  styleUrls: ['./graf-porcentaje.component.scss']
})

export class GrafPorcentajeComponent {
  aforo_max = 280;
  num_personas = 160;

  porcentaje = this.num_personas < this.aforo_max ? (this.num_personas * 100 / this.aforo_max) : 100;
  porcentaje_redondeado = this.porcentaje.toPrecision(2);
  
  porcentaje_actual = this.porcentaje === 100 ? "100%" : this.porcentaje_redondeado.toString() + "%";
}

