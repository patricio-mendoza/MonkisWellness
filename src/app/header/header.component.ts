// header.component.ts
// Componente que se muestra en el header de cada pagina para mayudar al usuario con la navegación.
// Autores:
// Patricio Mendoza Pasapera

import { Component, SimpleChanges } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  title: string = 'gimnasio';

  // Al iniciar obtiene el nómbre de la página
  constructor(private router: Router) {
    router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.title = e.url.substring(1);       
        // en inicio se pone 'gimnasio'
        this.title = !this.title || this.title === 'inicio' ? 'gimnasio' : this.title;
        this.title = this.title === 'misreservas' ? 'mis reservas' : this.title;
        this.title = this.title.substring(0,8) == 'reservar' ? 'reservaciones' : this.title;
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.title = this.title === null || 'inicio' ? 'gimnasio' : this.title;
    this.title = this.title === 'misreservas' ? 'mis reservas' : this.title;
    this.title = this.title.substring(0,8) == 'reservar' ? 'reservaciones' : this.title;
  }
}
