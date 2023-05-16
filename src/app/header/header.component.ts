import { Component, SimpleChanges } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  title: string = 'gimansio';

  ngOnChanges(changes: SimpleChanges) {
    this.title = this.title === null || 'inicio' ? 'gimnasio' : this.title;
    this.title = this.title === 'misreservas' ? 'mis reservas' : this.title;
    this.title = this.title.substring(0,8) == 'reservar' ? 'reservaciones' : this.title;
  }
}
