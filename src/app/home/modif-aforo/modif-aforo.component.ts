import { Component, Input } from '@angular/core';
import { HomeComponent } from '../home.component';

const API_URI = 'http://localhost:8888/api';


@Component({
  selector: 'app-modif-aforo',
  templateUrl: './modif-aforo.component.html',
  styleUrls: ['./modif-aforo.component.scss']
})
export class ModifAforoComponent extends HomeComponent{
  saveNewAforo() {
    if (this.newAforo.length === 0) { return }
    this.http.put(`${API_URI}/gym/updateAforo/${this.newAforo}`, {}).subscribe();
    this.miServicio.isModifyingAforo = false;
  }
}
