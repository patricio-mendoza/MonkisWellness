// auth.service.ts
// Servicio para autorización de usuarios
// Autor: Patricio Mendoza Pasapera
// 20/04/2023

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';

@Injectable({
   providedIn: 'root'
})
export class AuthService {
   isUserLoggedIn: boolean = false;
   isAdmin: boolean = false;
   
   reqData: any;

   constructor( private http: HttpClient) { }

   // Función para iniciar sesión
   login(matricula: string) {
      // obtener desde la API
      let promise = new Promise((resolve, reject) => {         
         let apiURL = `${API_URI}/user/${matricula.toUpperCase()}`;
         this.http.get(apiURL)
           .toPromise()
           .then( res => {
                  this.reqData = res;
                  if (!this.reqData.status || this.reqData.data.length === 0) {
                     this.isUserLoggedIn = false;
                     this.isAdmin = false;
                  } else {
                     let id = 'matricula' in this.reqData.data[0] ? this.reqData.data[0].matricula : this.reqData.data[0].num_nomina;

                     this.isUserLoggedIn = true;
                     this.isAdmin = id[0] === 'L';  

                     localStorage.setItem('token', this.reqData.token);
                     localStorage.setItem('id', id);
                  }
                  localStorage.setItem('isUserLoggedIn', this.isUserLoggedIn ? "true" : "false"); 
                  localStorage.setItem('isAdmin', this.isAdmin ? "true" : "false");  

                  resolve(res);
               }
            );
         });
         return promise;
   }

   // Función para cerrar sesión
   logout(): void {
      this.isUserLoggedIn = false;
      localStorage.clear(); 
   }
}
