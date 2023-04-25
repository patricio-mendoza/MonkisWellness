import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

const API_URI = 'http://localhost:8888/api';

@Injectable({
   providedIn: 'root'
})
export class AuthService {
   isUserLoggedIn: boolean = false;
   isAdmin: boolean = false;
   reqData: any;

   constructor(private http: HttpClient) { }

   login(matricula: string): Observable<any> {
      // obtener desde la API
      this.http.get(`${API_URI}/user/${matricula}`).subscribe(res => {
         this.reqData = res;

         if (this.reqData.data.length !== 0) {
            this.isUserLoggedIn = true;
            this.isAdmin = this.reqData.data[0].matricula ? false : true;
            console.log(this.isAdmin);
         }
      });
      
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
}
