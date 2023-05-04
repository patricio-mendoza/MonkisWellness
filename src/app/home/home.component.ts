import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  isAdmin = localStorage.getItem("isAdmin");

  isModifyingAforo: boolean = true;


  ocultar(){
    this.isModifyingAforo = !this.isModifyingAforo;
    console.log(this.isModifyingAforo)
  }
  
}
