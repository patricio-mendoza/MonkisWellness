import { Component } from '@angular/core';
import { CompartidovarService } from '../compartidovar.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent {
  constructor(private http: HttpClient, public miServicio : CompartidovarService){}

  openTab() {
    this.miServicio.isCheckingHistorial = true;
  }
}
