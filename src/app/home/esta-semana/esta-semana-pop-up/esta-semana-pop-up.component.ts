import { Component } from '@angular/core';
import { HomeComponent } from '../../home.component';
import { HttpHeaders } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';

@Component({
  selector: 'app-esta-semana-pop-up',
  templateUrl: './esta-semana-pop-up.component.html',
  styleUrls: ['./esta-semana-pop-up.component.scss']
})
export class EstaSemanaPopUpComponent extends HomeComponent {
  historial: number[];
  reqData: any;

  ngOnInit() {
    this.getDatosDeEstaSemana();
  }

  getDatosDeEstaSemana() {
    let apiURL = `${API_URI}/gym/estaSemana`;
    let token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.get(apiURL, {headers}).subscribe(res => {
      this.reqData = res;
      this.historial = this.reqData.data.map(x => x.aforo);
    });
  }

  closeEstaSemanaTab() {
    this.miServicio.isCheckingEstaSemana = false;
  }
}
