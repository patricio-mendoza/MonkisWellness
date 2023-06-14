import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CompartidovarService {
  
  MAXIMO_TIEMPO_RESERVA = 90 // tiempo en minutos
  TIME_INTERVAL_FOR_RESERVA = 30 // tiempo en minutos
  
  isModifyingAforo: boolean = false;
  isCheckingEstaSemana: boolean = false;
  isClosing: boolean = false;
  isLogged: boolean = false;
  isAdmin: boolean = false;
  isCheckingHistorial: boolean = false;

  reqData: any;

  // Observable que le indica a los componentes cuando otro componente cambia el estado del gimnasio para actuailizarlo
  private estadoSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  estado$ = this.estadoSubject.asObservable();

  cambiarEstado(nuevoEstado:boolean){
    this.estadoSubject.next(nuevoEstado);
  }

  constructor(private router: Router) {
    router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        let title = e.url;       
        this.isLogged = title.length !== 1;
      });
  }
}
