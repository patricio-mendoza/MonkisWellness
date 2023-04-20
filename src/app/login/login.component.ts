import { Component } from '@angular/core';
import { matriculasValidas } from './matriculas';
import { Router } from '@angular/router';

import { globals } from '../globals';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private router: Router) { }

  matricula: string = "";
  routeLink: string = 'inicio'

  matriculaInvalida: boolean = false

  login(): void {
    // CALL API WITH MATRICULA
    if (matriculasValidas.includes(this.matricula)){
      // Mandar a Inicio y settear "src/app.component.ts -> isLogged = True"
      this.router.navigateByUrl('/inicio');
    } else {
      this.matriculaInvalida = true;
    }
  }

  
}
