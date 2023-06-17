//Componente que proyecta las estimaciones de aforo en horas proximas, este componente se utiliza para obtener estimaciones de aforo de un servidor a través de una solicitud HTTP. Las estimaciones se obtienen en el método ngOnInit() y se asignan a las propiedades del componente.
//Autor: Omar Cota
//16/05/2023
import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';

@Component({
  selector: 'app-horas-proximas',
  templateUrl: './horas-proximas.component.html',
  styleUrls: ['./horas-proximas.component.scss']
})
export class HorasProximasComponent {
  estimacionEn1Horas: number;
  estimacionEn2Horas: number;
  estimacionEn3Horas: number;

  reqData: any

  constructor(private http: HttpClient) { }
  //El método ngOnInit() se ejecuta cuando el componente se inicializa. En este método, se llama al método getEstimaciones() para obtener las estimaciones.
  ngOnInit() {
    this.getEstimaciones();
  }

//El método getEstimaciones() se encarga de hacer una solicitud GET al servidor utilizando HttpClient. Primero, se obtiene un token de autenticación del almacenamiento local. Luego, se crea un encabezado que contiene el token de autorización. Después, se realiza la solicitud GET al URI http://localhost:8888/api/gym/estimaciones con los encabezados establecidos. Cuando se recibe la respuesta del servidor, se asigna a la propiedad reqData y se extraen las estimaciones de la respuesta y se asignan a las propiedades estimacionEn1Horas, estimacionEn2Horas y estimacionEn3Horas.
  getEstimaciones() {
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(`${API_URI}/gym/estimaciones`, {headers}).subscribe(res => {
      this.reqData = res;
      this.estimacionEn1Horas = this.reqData.data[0].aforo;
      this.estimacionEn2Horas = this.reqData.data[1].aforo;
      this.estimacionEn3Horas = this.reqData.data[2].aforo;
    });
  }
}
