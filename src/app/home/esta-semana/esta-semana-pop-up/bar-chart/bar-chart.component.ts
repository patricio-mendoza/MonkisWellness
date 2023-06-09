import { Component, Input, SimpleChanges } from '@angular/core';
import Chart, {Colors} from 'chart.js/auto';

Chart.register(Colors);


@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent {
  @Input() data: number[];
  public chart: any;

  constructor(){
    Chart.defaults.backgroundColor = 'white';
    Chart.defaults.borderColor = 'white';  
    Chart.defaults.color = 'white';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart) {
      this.chart.destroy();
    };
    this.createChart();
  }

  createChart(){
    this.chart = new Chart("MyChart", {
      type: 'bar',

      data: {
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
