import { Component } from '@angular/core';
import { HomeComponent } from '../../home.component';
import { HttpClient } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';

interface Historial {
  dia: string;
  aforo: number;
}

@Component({
  selector: 'app-esta-semana-pop-up',
  templateUrl: './esta-semana-pop-up.component.html',
  styleUrls: ['./esta-semana-pop-up.component.scss']
})
export class EstaSemanaPopUpComponent extends HomeComponent {
  historial: Historial[];
  reqData: any;

  ngOnInit() {
    this.getDatosDeEstaSemana();
  }

  getDatosDeEstaSemana() {
    let apiURL = `${API_URI}/gym/estaSemana`;
    
    this.http.get(apiURL).subscribe(res => {
      this.reqData = res;
      this.historial = this.reqData.data;
      console.log(this.historial)
    });
  }

  closeEstaSemanaTab() {
    this.miServicio.isCheckingEstaSemana = false;
  }
}
