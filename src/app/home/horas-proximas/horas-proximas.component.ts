import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';

@Component({
  selector: 'app-horas-proximas',
  templateUrl: './horas-proximas.component.html',
  styleUrls: ['./horas-proximas.component.scss']
})
export class HorasProximasComponent {
  estimacionEn1Horas: number;
  estimacionEn2Horas: number;
  estimacionEn3Horas: number;
  currentDateTime: Date;

  reqData: any

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getEstimaciones();
    this.currentDateTime = new Date();
  }

  getEstimaciones() {
    this.http.get(`${API_URI}/gym/estimaciones`).subscribe(res => {
      this.reqData = res;
      this.estimacionEn1Horas = this.reqData.data[0].aforo;
      this.estimacionEn2Horas = this.reqData.data[1].aforo;
      this.estimacionEn3Horas = this.reqData.data[2].aforo;
    });
  }
}
