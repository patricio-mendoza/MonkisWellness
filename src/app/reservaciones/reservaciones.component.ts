import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  isAdmin = localStorage.getItem('isAdmin') === "true";
  deportes: Deporte[] = [];
  deportesBloqueados: number[] = [];
  reqData: any;

  constructor(private http: HttpClient, private router : Router) { }

  ngOnInit(){
    this.getDeportes();
    this.getDeportesInactivos();
  }

  backgroundURL(nombre_deporte: string): string {
    let img_url = nombre_deporte.toLocaleLowerCase();
    img_url = img_url.replaceAll(' ', '_') + '.jpeg';
    img_url = '../../assets/foto_deporte/' + img_url;

    return img_url; 
  }

  getDeportes() {
    let apiURL = `${API_URI}/deportes`;
    let token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    this.http.get(apiURL, {headers}).subscribe(res => {
      this.reqData = res;
      this.deportes = this.reqData.data
    });
  }

  getDeportesInactivos() {
    let id = localStorage.getItem('id')
    let apiURL = `${API_URI}/deportes/bloqueados/${id}`;
    let token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    this.http.get(apiURL, {headers}).subscribe(res => {
      this.reqData = res;
      this.deportesBloqueados = this.reqData.data.map(x => x.id_deporte)
      console.log(this.deportesBloqueados)
    });
  }

  handleClick(espacioId: number) {
    if (!this.isAdmin && this.deportesBloqueados.includes(espacioId)) {
      alert("Solo puedes reservar una cancha al día por deporte");
      return;
    }
    this.router.navigate([`/reservarCancha/${espacioId}`]);
  }
}
