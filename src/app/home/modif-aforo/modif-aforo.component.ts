import { Component } from '@angular/core';
import { HomeComponent } from '../home.component';
import { HttpHeaders } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';


@Component({
  selector: 'app-modif-aforo',
  templateUrl: './modif-aforo.component.html',
  styleUrls: ['./modif-aforo.component.scss']
})

export class ModifAforoComponent extends HomeComponent{

  saveNewAforo() {
    if (this.newAforo.length === 0) { return }
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put(`${API_URI}/gym/updateAforo/${this.newAforo}`, {headers}).subscribe();
    this.miServicio.isModifyingAforo = false;
    this.miServicio.cambiarEstado(true);
  }
}
