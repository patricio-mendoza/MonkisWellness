import { Component} from '@angular/core';
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

  reqData: any;

  constructor(public http: HttpClient) { }

  ngOnInit() {
    this.getDataCharts();
  }

  getDataCharts() {    
    this.http.get(`${API_URI}/gym/estaSemana`).subscribe(res => {
      this.reqData = res;
      this.dataChartSemanal = this.reqData.data.map(x => x.aforo);
    });
  }

  getDatosHistorial() {
    let fecha = new Date();
    var offset = -(new Date().getTimezoneOffset() / 60);
    fecha.setHours(fecha.getHours() + offset - 6); // Restar 6 horas al ajustar la hora local
    let fechastr = fecha.toISOString().slice(0, 19).replace('T', ' ');
  
    let fecha_sem_ant = this.formatDateForLastWeek();
  
    let apiURL = `${API_URI}/gym/historial/${fechastr}/${fecha_sem_ant}`;
    this.http.get(apiURL).subscribe(res => {
      this.reqData = res;
      this.dataChartHistorial = this.reqData.data;
    });
  }
}
