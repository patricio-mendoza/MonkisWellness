import { Component } from '@angular/core';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-esta-semana-pop-up',
  templateUrl: './esta-semana-pop-up.component.html',
  styleUrls: ['./esta-semana-pop-up.component.scss']
})
export class EstaSemanaPopUpComponent extends HomeComponent {
  historial = [54, 125, 40, 192, 187, 101, 79];

  closeEstaSemanaTab() {
    this.miServicio.isCheckingEstaSemana = false;
  }
}
