import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  reqData: any

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getEstimaciones();
  }

  getEstimaciones() {
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(`${API_URI}/gym/estimaciones`, {headers}).subscribe(res => {
      this.reqData = res;
      this.estimacionEn1Horas = this.reqData.data[0].aforo;
      this.estimacionEn2Horas = this.reqData.data[1].aforo;
      this.estimacionEn3Horas = this.reqData.data[2].aforo;
    });
  }
}
