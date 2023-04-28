import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';

interface Reservaciones {

}

@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.component.html',
  styleUrls: ['./reservaciones.component.scss']
})
export class ReservacionesComponent implements OnInit {
  reservaciones: Reservaciones[];
  reqData: any;

  constructor(private http: HttpClient) { }

  ngOnInit(){
    this.getReservaciones();
  }

  getReservaciones() {
    let id = localStorage.getItem('id');
    let apiURL = `${API_URI}/user/reservaciones/${id}`;

    this.http.get(apiURL).subscribe(res => {
      this.reqData = res;
      this.reservaciones = this.reqData.data
    });
  }
}
