import { Component } from '@angular/core';

@Component({
  selector: 'app-editar-aforo',
  templateUrl: './editar-aforo.component.html',
  styleUrls: ['./editar-aforo.component.scss']
})
export class EditarAforoComponent {
  isAdmin = localStorage.getItem("isAdmin")
}
