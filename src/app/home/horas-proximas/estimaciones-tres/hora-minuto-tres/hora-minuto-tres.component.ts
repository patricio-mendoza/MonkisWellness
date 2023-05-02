import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hora-minuto-tres',
  templateUrl: './hora-minuto-tres.component.html',
  styleUrls: ['./hora-minuto-tres.component.scss']
})
export class HoraMinutoTresComponent implements OnInit {
  @Input() tiempo: number;

  horas: string;
  minutos: string;

  ngOnInit(): void {
    this.actualizarHora();
    setInterval(() => {
      this.actualizarHora();
    }, 1000);
  }

  actualizarHora() {
    const fecha = new Date();
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    this.horas = horas < 10 ? `0${horas}` : `${horas}`;
    this.minutos = minutos < 10 ? `0${minutos}` : `${minutos}`;
  }
}