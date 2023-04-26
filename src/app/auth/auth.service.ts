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

   login(matricula: string) {
      // obtener desde la API
      let promise = new Promise((resolve, reject) => {         
         let apiURL = `${API_URI}/user/${matricula}`;
         this.http.get(apiURL)
           .toPromise()
           .then( res => {
                  this.reqData = res;

                  if (this.reqData.data.length > 0) {
                     this.isUserLoggedIn = true;
                     this.isAdmin = this.reqData.data[0].matricula ? false : true;  
                  }
                  
                  localStorage.setItem('isUserLoggedIn', this.isUserLoggedIn ? "true" : "false"); 
                  localStorage.setItem('isAdmin', this.isAdmin ? "true" : "false");  

                  resolve(res);
               }
            );
         });
         return promise;
   }

   logout(): void {
      this.isUserLoggedIn = false;
      localStorage.clear(); 
   }
}
