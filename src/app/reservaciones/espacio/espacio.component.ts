import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';

interface Espacio{
  id_espacio: number,
  nombre_espacio: string,
  url_fotos: string,
  nombre_instalacion: string,
}

@Component({
  selector: 'app-espacio',
  templateUrl: './espacio.component.html',
  styleUrls: ['./espacio.component.scss']
})
export class EspacioComponent implements OnInit {
  espacios: Espacio[];
  id_espacio: number;
  nombre: string;

  reqData: any;

  constructor(private router : Router, private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id_espacio = +params.get('id')
    })
    let token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    this.http.get(`${API_URI}/deportes/cancha/${this.id_espacio}`, {headers}).subscribe(res => {
      this.reqData = res;
      this.espacios = this.reqData.data;
    });
    this.getNombreDeporte();
  }

  handleClick(espacioId: number) {
    this.router.navigate([`/reservarEspacio/${espacioId}`]);
  }
  getNombreDeporte() {
    let token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    this.http.get(`${API_URI}/deporte/${this.id_espacio}`, {headers}).subscribe(res => {
      this.reqData = res;
      this.nombre = this.reqData.data[0].nombre;
    });
  }
}