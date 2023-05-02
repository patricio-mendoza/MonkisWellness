import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-estimaciones',
  templateUrl: './estimaciones.component.html',
  styleUrls: ['./estimaciones.component.scss']
})
export class EstimacionesComponent {
  @Input() num_personas: number;
  @Input() lugar: number;

  aforo_max: number;
  porcentaje: number;
  porcentaje_redondeado: string;
  porcentaje_actual: string;
  currentDateTime: Date;

  ngOnInit() {
    this.currentDateTime = new Date();
    this.currentDateTime.setHours(this.currentDateTime.getHours()+this.lugar);
    this.aforo_max = 280;
    this.porcentaje = this.num_personas < this.aforo_max ? (this.num_personas * 100 / this.aforo_max) : 100;
    this.porcentaje_redondeado = this.porcentaje.toPrecision(2);
    this.porcentaje_actual = this.porcentaje === 100 ? "100%" : this.porcentaje_redondeado.toString() + "%";
  }
}