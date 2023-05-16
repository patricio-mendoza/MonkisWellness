import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URI } from '../../../server/server.js';

const API_URI = 'http://localhost:8888/api';

@Injectable({
  providedIn: 'root'
})
export class CompartidovarService {
  isModifyingAforo: boolean = false;
  isCheckingEstaSemana: boolean = false;
  isClosing: boolean = false;

  reqData: any;

}
