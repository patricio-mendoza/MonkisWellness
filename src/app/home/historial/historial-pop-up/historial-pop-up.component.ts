import { Component } from '@angular/core';
import { HomeComponent } from '../../home.component';
import { AfterViewInit } from '@angular/core';
import { Input } from '@angular/core';
const API_URI = 'http://localhost:8888/api';
interface registro{
  aforo:number;
  tiempo:string;
  dia:string;
}

@Component({
  selector: 'app-historial-pop-up',
  templateUrl: './historial-pop-up.component.html',
  styleUrls: ['./historial-pop-up.component.scss']
})
export class HistorialPopUpComponent extends HomeComponent {
  @Input() datos:registro[];
  historialDia:number = 0;
  dias:string[] = ["Domingo", "Lunes", "Martes", "Miércoles","Jueves", "Viernes", "Sábado"]
  historialPorDia:registro[][] = [[],[],[],[],[],[],[],[],[]];
  mapAforo:number[];
  cambiarDia(offset: number) {
    const totalDias = this.dias.length;
    this.historialDia = (this.historialDia + offset + totalDias) % totalDias;
    this.mapAforo = this.historialPorDia[this.historialDia].map(x => x.aforo)
  } 


  override ngOnInit(){
    console.log(this.datos);
    this.guardarPorDia();
    this.mapAforo = this.historialPorDia[this.historialDia].map(x => x.aforo)
  }
  

  
  closeEstaSemanaTab() {
    this.miServicio.isCheckingHistorial = false;
  }

  guardarPorDia(){ //por cada dia restar 6 horas a datos[i].
    let fechaaux:number;
    let fechaauxdt:Date;
    for (let i = 0; i < this.datos.length; i++) {
      switch(this.datos[i].dia){
        case("Monday"):
        this.historialPorDia[1].push(this.datos[i])
        break;
        case("Tuesday"):
        this.historialPorDia[2].push(this.datos[i])
        break;
        case("Wednesday"):
        this.historialPorDia[3].push(this.datos[i])
        break;
        case("Thursday"):
        this.historialPorDia[4].push(this.datos[i])
        break;
        case("Friday"):
        this.historialPorDia[5].push(this.datos[i])
        break;
        case("Saturday"):
        this.historialPorDia[6].push(this.datos[i])
        break;
        case("Sunday"):
        this.historialPorDia[0].push(this.datos[i])
        break;
      }
    }

    for (let j = 0; j < 7; j++) {
      for (let index = 0; index < 6; index++) {
       this.historialPorDia[j].shift()
      }
   }
  }

}
