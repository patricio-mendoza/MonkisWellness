import { Component,Input, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-graf-barras',
  templateUrl: './graf-barras.component.html',
  styleUrls: ['./graf-barras.component.scss']
})
export class GrafBarrasComponent {
  @Input() data: number[];
  public chart: any;

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart) {
      this.chart.destroy();
    };
    this.createChart();
  }

  createChart(){
    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
	       datasets: [
          {
            label: "Personas Promedio Por Dia",
            data: this.data,
            backgroundColor: 'white'
          }
        ]
      },
      options: {
        aspectRatio:2.5
      }
    });
  }
}
