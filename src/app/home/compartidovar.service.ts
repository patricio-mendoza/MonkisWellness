import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompartidovarService {
  isModifyingAforo: boolean = false;
  isCheckingEstaSemana: boolean = false;
  isLogged: boolean = false;

  constructor(private router: Router) {
    router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        let title = e.url;       
        this.isLogged = title.length !== 1;
      });
  }
}
