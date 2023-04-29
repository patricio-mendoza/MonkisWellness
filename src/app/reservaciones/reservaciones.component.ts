import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private router : Router) { }

  ngOnInit(){
    this.getDeportes();
  }

  backgroundURL(nombre_deporte: string): string {
    let img_url = nombre_deporte.toLocaleLowerCase();
    img_url = img_url.replaceAll(' ', '_') + '.jpeg';
    img_url = '../../assets/foto_deporte/' + img_url;

    return img_url; 
  }

  getDeportes() {
    let apiURL = `${API_URI}/deportes`;

    this.http.get(apiURL).subscribe(res => {
      this.reqData = res;
      this.deportes = this.reqData.data
    });
  }

  handleClick(espacioId: number) {
    this.router.navigate([`/reservarCancha/${espacioId}`]);
  }
}
