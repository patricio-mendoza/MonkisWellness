import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hora-minuto',
  templateUrl: './hora-minuto.component.html',
  styleUrls: ['./hora-minuto.component.scss']
})
export class HoraMinutoComponent implements OnInit {
  @Input() tiempo: number;
  @Input() lugar: number;
  
  ngOnInit(): void {
  }
}
