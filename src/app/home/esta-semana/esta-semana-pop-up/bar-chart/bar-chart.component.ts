import { Component, Input } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent {
  @Input() data: any;
  public chart: any;

  ngOnInit(): void {
    this.createChart();
  }

  createChart(){
    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
	       datasets: [
          {
            label: "Personas Promedio Por Dia",
            data: [this.data.Monday, this.data.Tuesday, this.data.Wednesday, this.data.Thursday, this.data.Friday, this.data.Saturday, this.data.Sunday],
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
