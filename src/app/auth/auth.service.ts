import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

import { matriculasValidas } from './matriculas';

@Injectable({
   providedIn: 'root'
})
export class AuthService {

   isUserLoggedIn: boolean = false;

   login(matricula: string): Observable<any> {
      this.isUserLoggedIn = matriculasValidas.includes(matricula);
      localStorage.setItem('isUserLoggedIn', this.isUserLoggedIn ? "true" : "false"); 
   
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
