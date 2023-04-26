import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-estado-gym',
  templateUrl: './estado-gym.component.html',
  styleUrls: ['./estado-gym.component.scss']
})

export class EstadoGymComponent {
  time = new Date();
  intervalId;
  estado:boolean = false;

  ngOnInit(){
    this.intervalId = setInterval(()=>{
      this.time = new Date();
    }, 1000);
  }

  ngOnDestroy(){
    clearInterval(this.intervalId);
  }
}
