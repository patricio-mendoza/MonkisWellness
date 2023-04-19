import { Component } from '@angular/core';
import { matriculasValidas } from './matriculas';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  matricula: string = "";

  login(): void {
    // CALL API WITH MATRICULA
    if (matriculasValidas.includes(this.matricula)){
      // Mandar a Inicio y settear "src/app.component.ts -> isLogged = True"
      console.log("is valid user");
    } else {
      // Añadir clase de incorrect en login CSS
    }
  }
}
