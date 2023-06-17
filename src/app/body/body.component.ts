// Body.component.ts
// Componente base que se despliega en todas las paginas y actua de forma de "contenedor" para otros componentes.
// Autores:
// Patricio Mendoza Pasapera

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})

export class BodyComponent{

  // La página tiene estos parámetros
  @Input() collapsed: boolean = false;
  @Input() screenWidth: number = 0;
  @Input() isLogged: boolean = false;

  title = "gimnasio"
  
  // Cambia su apariencia dependiendo de las variables del sistema
  getBodyClass(): string {
    let styleClass = '';
    if (!this.isLogged) {
      styleClass = 'body-full';
    } else if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'body-trimmed';
    } else {
      styleClass = 'body-md-screen';
    }
    return styleClass;
  }
}
