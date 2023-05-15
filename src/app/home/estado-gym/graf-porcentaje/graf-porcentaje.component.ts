import { Component, Input, SimpleChanges, HostListener } from '@angular/core';


@Component({
  selector: 'app-graf-porcentaje',
  templateUrl: './graf-porcentaje.component.html',
  styleUrls: ['./graf-porcentaje.component.scss']
})

export class GrafPorcentajeComponent {

  // Parámetros de aforo
  @Input() aforo_max: number;
  @Input() num_personas: number;

  // Variables de estilo y control de números
  porcentaje: number;
  porcentaje_redondeado: string;
  porcentaje_actual: string;

  radio: any;

  ngOnInit() {
    this.radio = window.innerWidth * 0.09;

  }
  
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.radio = window.innerWidth * 0.09;
    console.log('a');
  }

  // Cuando haya cambios actualiza la gráfica
  ngOnChanges(changes: SimpleChanges) {
    this.porcentaje = this.num_personas < this.aforo_max ? (this.num_personas * 100 / this.aforo_max) : 100;
    this.porcentaje_redondeado = this.porcentaje.toPrecision(2);
    this.porcentaje_actual = this.porcentaje === 100 ? "100%" : this.porcentaje_redondeado.toString() + "%";
  }
}