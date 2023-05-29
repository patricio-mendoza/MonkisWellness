import { Component, ChangeDetectorRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';

@Component({
  selector: 'app-estadisticas-admin',
  templateUrl: './estadisticas-admin.component.html',
  styleUrls: ['./estadisticas-admin.component.scss']
})
export class EstadisticasAdminComponent {
  dataChartSemanal: number[];
  dataChartEstancia: number[];
  dataChartHistorial: number[];

  labelsChartHistorial: string[];

  reqData: any;

  constructor(public http: HttpClient, private cdRef:ChangeDetectorRef) { }

  ngOnInit() {
    this.getDataCharts();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
}

  getDataCharts() {    
    // Esta Semana Fetch
    this.http.get(`${API_URI}/gym/estaSemana`).subscribe(res => {
      this.reqData = res;
      this.dataChartSemanal = this.reqData.data.map(x => x.aforo);
    });

    // Esta Historial Fetch
    let fecha = new Date();
    let fechastr = fecha.toISOString().slice(0, 19).replace('T', ' ');

    this.http.get(`${API_URI}/gym/historial/${fechastr}`).subscribe(res => {
      this.reqData = res;
      this.labelsChartHistorial = this.reqData.data.map(x => `${x.hora}:00`)
      this.dataChartHistorial = this.reqData.data.map(x => x.aforo);
    });
  }
}
