import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';

interface Deporte {
  id_deporte: number,
  nombre: string
}

@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.component.html',
  styleUrls: ['./reservaciones.component.scss']
})
export class ReservacionesComponent implements OnInit {
  deportes: Deporte[];
  reqData: any;

  constructor(private http: HttpClient) { }

  ngOnInit(){
    this.getDeportes();
  }

  getDeportes() {
    let apiURL = `${API_URI}/deportes`;

    this.http.get(apiURL).subscribe(res => {
      this.reqData = res;
      this.deportes = this.reqData.data
      console.log(this.deportes)
    });
  }
}
