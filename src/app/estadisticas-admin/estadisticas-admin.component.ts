import { Component, SimpleChanges} from '@angular/core';
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
  
  fechaPorCargar: Date | null;
  fechaInicio: Date | null;
  fechaFinal: Date | null;

  reqData: any;

  constructor(public http: HttpClient) { }

  ngOnInit() {
    this.getDataCharts(new Date());
  }

  getDataCharts(fecha: Date) {    
    let fechastr = fecha.toISOString().slice(0, 19).replace('T', ' ');

    // Esta Semana Fetch
    this.http.get(`${API_URI}/gym/semana/${fechastr}`).subscribe(res => {
      this.reqData = res;
      this.dataChartSemanal = this.reqData.data.map(x => x.aforo);
    });

    // Esta Historial Fetch
    this.http.get(`${API_URI}/gym/historial/${fechastr}`).subscribe(res => {
      this.reqData = res;
      this.labelsChartHistorial = this.reqData.data.map(x => `${x.hora}:00`)
      this.dataChartHistorial = this.reqData.data.map(x => x.aforo);
    });
  }

  recargarDatos(fechaPorCargar: Date) {
    if (fechaPorCargar === undefined) { 
      alert("No hay una fecha seleccionada para recargar los datos de la página."); 
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
    console.log(`${API_URI}/gym/descargar/${fechaInicioStr}/${fechaFinalStr}`)
    this.http.get(`${API_URI}/gym/descargar/${fechaInicioStr}/${fechaFinalStr}`).subscribe(res => {
      this.reqData = res;
      console.log(this.reqData.data)

      const data = this.reqData.data;
      const csvContent = this.convertToCSV(data);

      this.downloadCSV(csvContent, 'datos_gimnasio.csv');
    });
  }

  convertToCSV(data: any[]): string {
    const separator = ',';
    const keys = Object.keys(data[0]);

    const headerRow = keys.join(separator);
    const rows = data.map(row => {
      const values = keys.map(key => row[key]);
      return values.join(separator);
    });

    return `${headerRow}\n${rows.join('\n')}`;
  }

  downloadCSV(content: string, filename: string) {
    const element = document.createElement('a');
  const csvData = new Blob([content], { type: 'text/csv' });

  if ((navigator as any).msSaveBlob) {
    // For IE and Edge
    (navigator as any).msSaveBlob(csvData, filename);
  } else {
    // For other browsers
    const csvUrl = URL.createObjectURL(csvData);
    element.href = csvUrl;
    element.download = filename;

    // Check if the browser supports the "download" attribute
    if (element.download) {
      element.click();
    } else {
      // For Safari and other browsers that do not support the "download" attribute
      const windowRef = window.open(csvUrl);
      const htmlContent = '<pre>' + content + '</pre>';
      windowRef.document.write(htmlContent);
      windowRef.document.close();
    }

    URL.revokeObjectURL(csvUrl);
  }
  }
}