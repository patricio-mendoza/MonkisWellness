import { Component } from '@angular/core';

@Component({
  selector: 'app-graf-porcentaje',
  templateUrl: './graf-porcentaje.component.html',
  styleUrls: ['./graf-porcentaje.component.scss']
})

export class GrafPorcentajeComponent {
  aforo_max = 280;

  num_personas = 250;
  porcentaje = (this.num_personas * 100 / this.aforo_max);
  porcentaje_redondeado = this.porcentaje.toPrecision(2);
  
  porcentaje_actual = this.porcentaje === 100 ? "100%" : this.porcentaje_redondeado.toString() + "%";
  signo_porciento = "%";
  /* constructor() {
    this.calcularPorcentaje();
  }

  private calcularPorcentaje() {
    //this.porcentaje = this.num_personas * 100 / 280;
    if (this.num_personas === 280) {
      this.porcentaje = 50;
    }
    //this.porcentaje_redondeado = this.porcentaje.toPrecision(2);
    //this.porcentaje_actual = this.porcentaje_redondeado.toString() + this.signo_porciento;
  } */
}


