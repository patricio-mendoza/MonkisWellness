import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URI } from '../../../../../server/server.js'

const API_URI = 'http://localhost:8888/api';

@Component({
  selector: 'app-cierres',
  templateUrl: './cierres.component.html',
  styleUrls: ['./cierres.component.scss']
})
export class CierresComponent {
  estado:boolean = true;
  
  /*
  reqData: any;
  
  constructor(private http: HttpClient) { }

  ngOnInit(){
    this.getEstadoGym();
  }

  getEstadoGym() {
    let apiURL = `${API_URI}/gym/estado`;
    this.http.get(apiURL).subscribe(res => {
      this.reqData = res;
      this.estado = this.reqData.estado;
    });
  }*/
}
