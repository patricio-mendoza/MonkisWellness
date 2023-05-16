import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompartidovarService {
  isModifyingAforo: boolean = false;
  isCheckingEstaSemana: boolean = false;
  isClosing: boolean = false;
}
