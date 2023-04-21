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
  
  onClickSubmit(data: any) {
    this.matricula = data.matricula;

    this.authService.login(this.matricula)
      .subscribe( data => { 
        console.log("Is Login Success: " + data); 
        
        if(data) {
          this.router.navigate(['/inicio']);
          window.location.replace("http://localhost:4200/inicio");
        } 
    });
  }
}
