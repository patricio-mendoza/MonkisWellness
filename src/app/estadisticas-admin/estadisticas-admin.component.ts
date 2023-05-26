import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';

const API_URI = 'http://localhost:8888/api';

@Component({
  selector: 'app-estadisticas-admin',
  templateUrl: './estadisticas-admin.component.html',
  styleUrls: ['./estadisticas-admin.component.scss']
})
export class EstadisticasAdminComponent implements OnInit, AfterContentChecked {
  public chartSemanal: any;
  public chartEstancia: any;
  public chartHistorial: any;

  dataChartSemanal = [120,42,23,45,86,3,132];
  dataChartEstancia = [120,42,23,45,86,3,132];
  dataChartHistorial = [120,42,23,45,86,3,132];

  reqData: any;

  constructor(public http: HttpClient, private changeDetector: ChangeDetectorRef){ }

  ngOnInit() {
    this.getDataCharts();
  }
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  createCharts() {
    this.chartSemanal = new Chart('chart-semanal', {
      type: 'bar',
      data: {
        labels: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
	      datasets: [
          {
            label: "Personas Promedio Por Dia",
            data: this.dataChartSemanal,
            backgroundColor: '#004891'
          }
        ]
      },
      options: {
        aspectRatio:2.5
      }
    });

    this.chartEstancia = new Chart('chart-estancia', {
      type: 'bar',
      data: {
        labels: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
	      datasets: [
          {
            label: "Personas Promedio Por Dia",
            data: this.dataChartSemanal,
            backgroundColor: '#004891'
          }
        ]
      },
      options: {
        aspectRatio:2.5
      }
    });

    this.chartHistorial = new Chart('chart-historial', {
      type: 'bar',
      data: {
        labels: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
	      datasets: [
          {
            label: "Personas Promedio Por Dia",
            data: this.dataChartSemanal,
            backgroundColor: '#004891'
          }
        ]
      },
      options: {
        aspectRatio:2.5
      }
    });
  }

  getDataCharts() {    
    this.http.get(`${API_URI}/gym/estaSemana`).subscribe(res => {
      this.reqData = res;
      this.chartSemanal = this.reqData.data.map(x => x.aforo);
      console.log(this.chartSemanal)
    });
  }
}
