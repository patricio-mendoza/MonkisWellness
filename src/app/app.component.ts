import { Component, SimpleChanges } from '@angular/core';
import { CompartidovarService } from './home/compartidovar.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WellnessApp';
  
  isLogged: boolean = this.miservicio.isLogged;
  isSideNavCollapsed: boolean = false;
  screenWidth: number = 0;

  ngOnChanges(changes: SimpleChanges) {
    this.isLogged = this.miservicio.isLogged;
  }

  constructor(public miservicio: CompartidovarService) {}

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
