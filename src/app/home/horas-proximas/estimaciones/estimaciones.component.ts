// estimaciones.component.ts
// Detecta y cambia los valores de las estimaciones
// Omar Cota Rodriguez
// 20/04/2023

import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-estimaciones',
  templateUrl: './estimaciones.component.html',
  styleUrls: ['./estimaciones.component.scss']
})
export class EstimacionesComponent {
  @Input() num_personas: number;
  @Input()aforo_max: number;
  @Input() lugar: number;

  porcentaje: number;
  porcentaje_redondeado: string;
  porcentaje_actual: string;
  currentDateTime: Date;

  // Valores iniciales
  ngOnInit() {
    this.currentDateTime = new Date();
    this.currentDateTime.setHours(this.currentDateTime.getHours()+this.lugar);
    this.aforo_max = 280;
  }

  // Detección de cambios
  ngOnChanges(changes: SimpleChanges) {
    this.porcentaje = this.num_personas < this.aforo_max ? (this.num_personas * 100 / this.aforo_max) : 100;
    this.porcentaje_redondeado = this.porcentaje.toPrecision(2);
    this.porcentaje_actual = this.porcentaje === 100 ? "100%" : this.porcentaje_redondeado.toString() + "%";
  }
}