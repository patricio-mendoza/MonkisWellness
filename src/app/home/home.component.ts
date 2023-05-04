import { Component } from '@angular/core';
import { CompartidovarService } from './compartidovar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {


  isAdmin = localStorage.getItem("isAdmin");

  constructor(public miServicio : CompartidovarService){}



  ocultar(){
    this.miServicio.isModifyingAforo = !this.miServicio.isModifyingAforo;
  }
  
}
