import { Component, OnInit } from '@angular/core';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'WellnessApp';
  
  isLogged: boolean = true;
  isSideNavCollapsed: boolean = false;
  screenWidth: number = 0;

  ngOnInit() {
    let storeData = localStorage.getItem("isUserLoggedIn");

    if(storeData != null && storeData == "true")
       this.isLogged = true;
    else
       this.isLogged = false;
 }
  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
  porcentaje_actual = 75;
}
