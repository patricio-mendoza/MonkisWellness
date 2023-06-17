// login.component.ts
// Componente inicial de la aplicacion que verifica las credenciales del usuario.
// Autores:
// Patricio Mendoza Pasapera
// 17/04/2021

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  matricula: string = "";
  matriculaInvalida: boolean = false;
  formData!: FormGroup;

  constructor(private authService : AuthService, private router : Router) { }

  ngOnInit() {
    this.authService.logout();
    
    this.formData = new FormGroup({
      matricula: new FormControl(""),
    });
  }
  
  // llamada al API que recibe la info del usuario.
  onClickSubmit(data: any) {
    this.matricula = data.matricula;

    this.authService.login(this.matricula).then( () => {
      if (localStorage.getItem("isUserLoggedIn") === "true") {
        this.router.navigate(['/inicio']);
      } else {
        this.matriculaInvalida = true;
      }
    });
  }
}
