import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {
  
  @Input() isLogged: boolean = false;
  @Input() collapsed: boolean = false;
  @Input() screenWidth: number = 0;

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
