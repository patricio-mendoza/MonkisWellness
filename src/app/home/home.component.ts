import { Component } from '@angular/core';
import { CompartidovarService } from './compartidovar.service';
import { HttpClient } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  isAdmin = localStorage.getItem("isAdmin") === "true";
  newAforo: string;

  constructor(private http: HttpClient, public miServicio : CompartidovarService){}

  ocultar(){
    this.miServicio.isModifyingAforo = !this.miServicio.isModifyingAforo;
  }
  saveNewAforo() {
    if (this.newAforo.length === 0) { return }
    this.http.put(`${API_URI}/gym/updateAforo/${this.newAforo}`, {}).subscribe();
    this.miServicio.isModifyingAforo = false;
  }
}
