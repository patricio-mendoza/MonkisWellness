import { Component } from '@angular/core';
import { CompartidovarService } from '../compartidovar.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-esta-semana',
  templateUrl: './esta-semana.component.html',
  styleUrls: ['./esta-semana.component.scss']
})
export class EstaSemanaComponent {
  reqData:any;

  constructor(private http: HttpClient, public miServicio : CompartidovarService){}

  openTab() {
    this.miServicio.isCheckingEstaSemana = true;
  }
}
