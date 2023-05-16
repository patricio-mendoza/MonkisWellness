import { Component } from '@angular/core';
import { CompartidovarService } from '../compartidovar.service';
import { HomeComponent } from '../home.component';

const API_URI = 'http://localhost:8888/api';

@Component({
  selector: 'app-cierres',
  templateUrl: './cierres.component.html',
  styleUrls: ['./cierres.component.scss']
})
export class CierresComponent extends HomeComponent{

  estado:boolean;
  reqData: any;
  
  ngOnInit(){
    this.getEstadoGym;
  }
  
  getEstadoGym() {
    let apiURL = `${API_URI}/gym/estado`;
    this.http.get(apiURL).subscribe(res => {
      this.reqData = res;
      this.estado = this.reqData.estado;
    });
  }

}
