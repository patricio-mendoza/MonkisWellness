import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CompartidovarService {
  
  isModifyingAforo: boolean = false;
  isCheckingEstaSemana: boolean = false;
  isClosing: boolean = false;

  reqData: any;

  // Observable que le indica a los componentes cuando otro componente cambia el estado del gimnasio para actuailizarlo
  private estadoSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  estado$ = this.estadoSubject.asObservable();

  cambiarEstado(nuevoEstado:boolean){
    this.estadoSubject.next(nuevoEstado);
  }

}
