import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

import { matriculasValidas, nominasValidas } from './matriculas';

@Injectable({
   providedIn: 'root'
})
export class AuthService {
   isUserLoggedIn: boolean = false;
   isAdmin: boolean = false;

   login(matricula: string): Observable<any> {
      // obtener desde la API
      this.isUserLoggedIn = matriculasValidas.includes(matricula) || nominasValidas.includes(matricula);
      this.isAdmin = nominasValidas.includes(matricula);

      localStorage.setItem('isUserLoggedIn', this.isUserLoggedIn ? "true" : "false"); 
      localStorage.setItem('isAdmin', this.isAdmin ? "true" : "false"); 
   
   return of(this.isUserLoggedIn).pipe(
      tap(val => { 
         console.log("Is User Authentication is successful: " + val); 
      })
   );
   }

   logout(): void {
      this.isUserLoggedIn = false;
      localStorage.clear(); 
   }

   constructor() { }
}
