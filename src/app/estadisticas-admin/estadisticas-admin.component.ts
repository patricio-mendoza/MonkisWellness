import { Component, SimpleChanges} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  
  fechaPorCargar: Date | null;
  fechaInicio: Date | null;
  fechaFinal: Date | null;

  reqData: any;

  constructor(public http: HttpClient) { }

  ngOnInit() {
    this.getDataCharts(new Date());
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getDataCharts(new Date());
  }

  getDataCharts(fecha: Date) {    
    let fechastr = fecha.toISOString().slice(0, 19).replace('T', ' ');
    
    let token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Esta Semana Fetch
    this.http.get(`${API_URI}/gym/semana/${fechastr}`, {headers}).subscribe(res => {
      this.reqData = res;
      this.dataChartSemanal = this.reqData.data.map(x => x.aforo);
    });

    // Esta Historial Fetch
    this.http.get(`${API_URI}/gym/historial/${fechastr}`, {headers}).subscribe(res => {
      this.reqData = res;
      this.labelsChartHistorial = this.reqData.data.map(x => `${x.hora}:00`)
      this.dataChartHistorial = this.reqData.data.map(x => x.aforo);
    });
  }

  recargarDatos(fechaPorCargar: Date) {
    if (fechaPorCargar === undefined) { 
      alert("No hay una fecha seleccionada para recargar los datos de la página."); 
      return;
    } else if (fechaPorCargar > new Date()) {
      alert("No se pueden cargar datos de una fecha futura");
      return;
    }
    this.getDataCharts(fechaPorCargar);
  }

  descargarDatos(fechaInicio: Date, fechaFinal: Date) {
    if (fechaInicio === undefined || fechaFinal === undefined) { 
      if (fechaInicio === undefined) { alert("Selecciona un rango de fecha para descargar."); }
      else { alert("Selecciona un final al rango de fecha para descargar."); }
      return;
    }
  
    let fechaInicioStr = fechaInicio.toISOString().slice(0, 19).replace('T', ' ');
    let fechaFinalStr = fechaFinal.toISOString().slice(0, 19).replace('T', ' ');

    let token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(`${API_URI}/gym/descargar_datos/${fechaInicioStr}/${fechaFinalStr}`, {headers}).subscribe(res => {
      this.reqData = res;
    });
  }
}
