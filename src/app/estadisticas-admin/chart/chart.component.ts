import { Component, Input, SimpleChanges } from '@angular/core';
import Chart, { ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
  @Input() type: ChartType;
  @Input() label: string;
  @Input() labels: string[];
  @Input() data: number[];

  public chart: any;

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart) {
      this.chart.destroy();
    };
    this.createChart();
  }

  createChart() {
    this.chart = new Chart("MyChart", {
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
