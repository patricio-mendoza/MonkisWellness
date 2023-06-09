import { Component,Input, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-graf-barras',
  templateUrl: './graf-barras.component.html',
  styleUrls: ['./graf-barras.component.scss']
})
export class GrafBarrasComponent {
  @Input() data: number[] ;
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
        labels: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'],
	       datasets: [
          {
            label: "Personas por hora",
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
