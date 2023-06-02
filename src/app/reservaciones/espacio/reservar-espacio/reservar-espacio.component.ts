import { Component, Input } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CardService } from './card.service';


const API_URI = 'http://localhost:8888/api';

interface Bloqueo {
    start: Date;
    end: Date;
}

interface Reservacion {
    id: number;
    dueno: string;
    hora: string;
    fecha: string;
}


@Component({
  selector: 'app-reservar-espacio',
  templateUrl: './reservar-espacio.component.html',
  styleUrls: ['./reservar-espacio.component.scss']
})
export class ReservarEspacioComponent {
    isAdmin = localStorage.getItem('isAdmin') === "true"

    today = new Date();
    tomorrow = new Date();
    selectedDate: any = []

    invalidRequest: boolean = false;
    clicked: boolean = false;

    id_espacio: number;
    nombreEspacio: string;
    nombreInstalacion: string;

    hora_inicio: number = 6;
    hora_fin: number = 23;

    reqData: any;
    bloqueos: Bloqueo[];
    reservaciones: Reservacion[] = [];

    horaReserva: string;
    fecha: string;
    id: string;

    constructor(public tarjeta:CardService, private location: Location, private datepipe: DatePipe,private route: ActivatedRoute, private http: HttpClient) {
      this.tomorrow.setDate(this.today.getDate() + 1);
      this.tomorrow.setHours(22, 0, 0);
    
      if(this.today.getHours() > 22) this.today.setHours(24);
    }

    abrirTarjeta(){
        this.tarjeta.idBlocking = true;
      }
  
      cerrarTarjeta(){
          this.tarjeta.idBlocking = false;
      }

    ngOnInit() {
        this.getBloqueosActivos();
        this.getHorarioInstalacion();

        if (this.isAdmin) {
            this.getReservaciones();
        }
    }
    
    getBloqueosActivos(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id_espacio = +params.get('id')
        })
        this.http.get(`${API_URI}/reservaciones/espacio/${this.id_espacio}`).subscribe(res => {
            this.reqData = res;
            this.bloqueos = this.reqData.data;
        });
    }
    getHorarioInstalacion(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id_espacio = +params.get('id')
        })
        this.http.get(`${API_URI}/instalacion/horario/${this.id_espacio}`).subscribe(res => {
            this.reqData = res
            this.hora_inicio = this.reqData.data[0].apertura;
            this.hora_fin = this.reqData.data[0].cierre;
            this.nombreEspacio = this.reqData.data[0].nombre;
            this.nombreInstalacion = this.reqData.data[0].nombreInstalacion
            
        });
    }

    getReservaciones() {
        this.http.get(`${API_URI}/reservacionesActivas/espacio/${this.id_espacio}`).subscribe(res => {
            this.reqData = res;
            this.reservaciones = this.reqData.data;
        });
    }

    reservar(): void {
        if (this.selectedDate === null || this.selectedDate[0] === null || this.selectedDate[1] === null) {
            this.invalidRequest = true;
            return;
        }
        
        this.clicked = true;
        
        let formattedStartDate = this.datepipe.transform(this.selectedDate[0], 'yyyy-MM-dd HH:mm:ss')
        let formattedFinishDate = this.datepipe.transform(this.selectedDate[1], 'yyyy-MM-dd HH:mm:ss')

        const headers = { 'Content-Type': 'application/json' };
        const options = { headers: headers };
        const body = {
            matricula : localStorage.getItem('isAdmin') === 'false' ? localStorage.getItem('id') : null,
            num_nomina : localStorage.getItem('isAdmin') === 'true' ? localStorage.getItem('id') : null,
            id_espacio : this.id_espacio,
            hora_entrada : formattedStartDate,
            hora_salida : formattedFinishDate,
            prioridad : localStorage.getItem('isAdmin') === 'true' ? 1 : 2,
            estatus : 1,
            nombreEspacio: this.nombreEspacio,
            nombreInstalacion: this.nombreInstalacion
        };

        this.http.post(`${API_URI}/reservar/espacio`, JSON.stringify(body), options).subscribe(res => {
            this.reqData = res;
            if (this.reqData.status) {
                // get most current reservation and compare to avoid conflicts
                window.location.replace(this.location.path());
            }
        });
        const bodyAviso = {
            matricula : localStorage.getItem('isAdmin') === 'false' ? localStorage.getItem('id') : null,
            encabezado: 'Reservacion Confirmada',
            texto: `Tu reservación en la ${this.nombreEspacio} en el ${this.nombreInstalacion} ha sido confirmada.`,
            id_reservacion: 'LAST_INSERT_ID()'
        }
        this.http.post(`${API_URI}/generar/aviso`, JSON.stringify(bodyAviso), options).subscribe();
    }

    cancelarReservacion(id: number, dueno: string) {
        const headers = { 'Content-Type': 'application/json' };
        const options = { headers: headers };
        const body = {
            matricula: dueno,
            encabezado: 'Reservacion Cancelada',
            texto: `Tu reservación en la ${this.nombreEspacio} en el ${this.nombreInstalacion} ha sido cancelada por un administrador.`,
            id_reservacion: id
        };
      
        this.http.delete(`${API_URI}/reservacion/delete/${id}`).subscribe();
        this.http.post(`${API_URI}/generar/aviso`, JSON.stringify(body), options).subscribe();
        window.location.replace(this.location.path());
    }
}
