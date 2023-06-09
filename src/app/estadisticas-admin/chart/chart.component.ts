// chart.component.ts
// Componente secundario que despliega la gráfica
// Autor: Patricio Mendoza Pasapera
// 26/05/2023

import { Component, Input, SimpleChanges } from '@angular/core';
import Chart, { ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
  @Input() my_id: string;
  @Input() type: ChartType;
  @Input() label: string;
  @Input() labels: string[];
  @Input() data: number[];

  public chart: any;

  constructor(){
    Chart.defaults.backgroundColor = 'lightgray';
    Chart.defaults.borderColor = 'lightgray';  
    Chart.defaults.color = 'black';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart) {
      this.chart.destroy();
    };
    this.createChart();
  }

  // Crea la gráfica con los datos enviados por la página de estadíticas
  createChart() {
    this.chart = new Chart(this.my_id, {
      type: this.type,
      data: {
        labels: this.labels,
	      datasets: [
          {
            label: this.label,
            data: this.data,
            backgroundColor: '#004891'
          }
        ]
      },
      options: {
        aspectRatio:2.5
      }
    });
  }
}
