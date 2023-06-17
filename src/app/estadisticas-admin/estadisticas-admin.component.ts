// estadisticas-admin.component.ts
// Este componente nos ayuda a crear la pagina de estadisticas para los administradores.
// Creamos tres graficas y agregamos dos funcionalidades mas, una nos permite seleccionar 
// una fecha y recargar los datos para que se generen las graficas con datos de la fecha seleccionada,
// la otra funcionalidad nos permite seleccionar un rango de fechas y descargar un documento
// .csv con los datos de estas fechas seleccionadas.
// Autores:
// Nora Villarreal y Patricio Medoza

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

  // hace la llamada a la API para llenar los datos de las graficas con el dia que se le mande
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

  // cuando se selecciona una fecha distinta, este metodo hace la llamada al API con dicha fehca
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

  // El siguiente metodo sirve para descargar los datos en formato CSV, 
  //Realiza validaciones y llamadas a la API utilizando HttpClient
  descargarDatos(fechaInicio: Date, fechaFinal: Date) {
    if (fechaInicio === undefined || fechaFinal === undefined) { 
      alert("Selecciona un rango de fecha valido para descargar.");
      return;
    }

    if (fechaInicio > new Date() || fechaFinal > new Date()) {
      alert("No se pueden descargar datos futuros. \nSelecciona un rango de recha valido.");
      return;
    }

    let fechaInicioStr = fechaInicio.toISOString().slice(0, 10).replace('T', ' ');
    let fechaFinalStr = fechaFinal.toISOString().slice(0, 10).replace('T', ' ');

    let token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.get(`${API_URI}/gym/descargar/${fechaInicioStr}/${fechaFinalStr}`, {headers}).subscribe(res => {
      this.reqData = res;

      const data = this.reqData.data;
      console.log(data)
      const csvContent = this.convertToCSV(data);

      this.downloadCSV(csvContent, 'datos_gimnasio.csv');
    });
  }

  // El siguiente metodo recibe un arreglo de datos y los convierte en una cadena en formato CSV
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
    // Para IE y Edge
    (navigator as any).msSaveBlob(csvData, filename);
  } else {
    // Para otros navegadores
    const csvUrl = URL.createObjectURL(csvData);
    element.href = csvUrl;
    element.download = filename;

    // Verificar que el navegador admita el atributo "download" 
    if (element.download) {
      element.click();
    } else {
      // Para navegadores que no admitan el atributo "download" 
      const windowRef = window.open(csvUrl);
      const htmlContent = '<pre>' + content + '</pre>';
      windowRef.document.write(htmlContent);
      windowRef.document.close();
    }

    URL.revokeObjectURL(csvUrl);
  }
  }
}
