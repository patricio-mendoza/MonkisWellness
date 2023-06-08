import { Component } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CompartidovarService } from '../../../home/compartidovar.service';
import { CardService } from './card.service';
import { set } from 'mongoose';

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

interface Hora {
    hora: string;
    is_selected: boolean;
    is_disabled: boolean;
    is_available: boolean;
}

function isEqualDate(date1: Date, date2: Date): boolean {
    return (date1.getFullYear() === date2.getFullYear() && 
            date1.getMonth() === date2.getMonth() && 
            date1.getDate() === date2.getDate());
}

@Component({
  selector: 'app-reservar-espacio',
  templateUrl: './reservar-espacio.component.html',
  styleUrls: ['./reservar-espacio.component.scss']
})
export class ReservarEspacioComponent {
    isAdmin = localStorage.getItem('isAdmin') === "true";

    today = new Date();
    tomorrow = new Date();

    _selectedDate: Date = new Date();
    selectedHourStart: Hora;
    selectedHourEnd: Hora;

    id_espacio: number;
    nombreEspacio: string;
    nombreInstalacion: string;
    idInstalacion: number;

    reqData: any;
    horas: Hora[];
    bloqueos: Bloqueo[];
    reservaciones: Reservacion[] = [];
    bloqueosEspacio: any[] = [];

    bloqueosCargados:boolean = false;

    constructor(public tarjeta: CardService,
                private location: Location, 
                public datepipe: DatePipe,
                private route: ActivatedRoute, 
                public http: HttpClient,
                public miServicio : CompartidovarService) 
    {
      this.tomorrow.setDate(this.today.getDate() + 1);
      this.tomorrow.setHours(22, 0, 0);
      this.bloqueosCargados = false;

    
      if (this.today.getHours() > 22) this.today.setHours(24);
    }



    abrirTarjeta() {
        this.tarjeta.idBlocking = true;
    }

    cerrarTarjeta() {
        this.tarjeta.idBlocking = false;
    }

    get selectedDate(): Date {
        return this._selectedDate;
    }
    
    set selectedDate(value: Date) {
        if (value !== this._selectedDate) {
            this._selectedDate = value;
            this.selectedHourStart = null;
            this.selectedHourEnd = null;

            if (isEqualDate(value, this.today) || isEqualDate(value, this.tomorrow)) {
                this.getHorasDisponibles(value);
            } else {
                this.horas = [];
            }
        }
    }

    sumMinutesToHour(hora: string, minutes: number) {
        const [hour, minute] = hora.split(":").map(Number);
        const totalMinutes = hour * 60 + minute + minutes;
        const newHour = Math.floor(totalMinutes / 60);
        const newMinute = totalMinutes % 60;

        const formattedHour = String(newHour).padStart(2, "0");
        const formattedMinute = String(newMinute).padStart(2, "0");

        return `${formattedHour}:${formattedMinute}`;
    }
    hourIsBigger(hour1: string, hour2: string) {
        const [firstHourValue, firstMinuteValue] = hour1.split(":").map(Number);
        const [secondHourValue, secondMinuteValue] = hour2.split(":").map(Number);

        if (firstHourValue > secondHourValue) {
            return true;
        } else if (firstHourValue === secondHourValue && firstMinuteValue > secondMinuteValue) {
            return true;
        } else {
            return false;
        }
    }

    ngOnInit() {
        this.getHorarioInstalacion();
        this.getBloqueos();

        if (this.isAdmin) {
            this.getReservaciones();
        }
    }

    getBloqueos(): void {
        let token = localStorage.getItem('token');
        const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json');
        const options = { headers: headers };

        this.http.get(`${API_URI}/reservaciones/bloqueos_espacio/${this.id_espacio}`, options).subscribe(res => {
            this.reqData = res;
            this.bloqueosEspacio = this.reqData.data;
            this.bloqueosCargados = true;
        })
    }

    selectHora(horaSeleccionada: Hora) {
        if (horaSeleccionada.is_disabled) {return;}

        let checkOverlap = false;

        if (!this.selectedHourStart && !this.selectedHourEnd) {
            // seleccionar hora de entrada y salida
            this.selectedHourStart = horaSeleccionada;
            horaSeleccionada.is_selected = true; 

            checkOverlap = true;

        } else if (this.selectedHourStart && !horaSeleccionada.is_available) {
            // reemplazar hora de entrada
            this.selectedHourStart.is_selected = false;
            this.selectedHourStart = horaSeleccionada;
            horaSeleccionada.is_selected = true;
            // borrar hora de salida
            if (this.selectedHourEnd) { 
                this.selectedHourEnd.is_selected = false;
                this.selectedHourEnd = null; 
            }
            checkOverlap = true;

        } else if (this.selectedHourStart && !this.selectedHourEnd) {
            if (this.selectedHourStart == horaSeleccionada) { return; }
            // seleccionar hora fin
            this.selectedHourEnd = horaSeleccionada;
            this.selectedHourEnd.is_selected = true;
        } else if (this.selectedHourStart && this.selectedHourEnd) { 
            // si hora_seleccionada es la hora de salida, reemplazar hora de entrada
            if (horaSeleccionada == this.selectedHourEnd) {
                this.selectedHourStart.is_selected = false;
                this.selectedHourStart = this.selectedHourEnd;
                this.selectedHourEnd = null;

                checkOverlap = true;
            } else {
                // reemplazar hora fin
                this.selectedHourEnd.is_selected = false;
                this.selectedHourEnd = horaSeleccionada;
                this.selectedHourEnd.is_selected = true;
            }
        }
        if (checkOverlap) {
            // checar las horas que se pueden seleccionar
            let overlap = false;
            for(let i = 0; i < this.horas.length; i++) {
                if (!(this.hourIsBigger(horaSeleccionada.hora, this.horas[i].hora) || this.hourIsBigger(this.horas[i].hora, this.sumMinutesToHour(horaSeleccionada.hora, this.miServicio.MAXIMO_TIEMPO_RESERVA - this.miServicio.TIME_INTERVAL_FOR_RESERVA)))) {
                    // revisar que no haya una reservacion entre la hora seleccionada y las posibles horas disponibles
                    if (!this.horas[i].is_disabled && !overlap) {
                        this.horas[i].is_available = true;
                    } else {
                        overlap = true;
                        this.horas[i].is_available = false;
                    }
                } else {
                    this.horas[i].is_available = false;
                }
            }
        }
    }

    getHorasDisponibles(dia: Date): void {
        let diaFormateado = this.datepipe.transform(dia, 'yyyy-MM-dd');
        let token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        
        this.http.get(`${API_URI}/instalacion/horas_disponibles/${this.idInstalacion}/${diaFormateado}/${this.miServicio.TIME_INTERVAL_FOR_RESERVA}`, {headers}).subscribe({
            next: (res) => {
                this.reqData = res
                const horasNoFiltradas = this.reqData.data;

                if (isEqualDate(this.today, dia)) {
                    const date = new Date();
                    const hour = date.getHours();
                    const minutes = date.getMinutes();

                    const formattedHour = hour.toString().padStart(2, '0');
                    const formattedMinutes = minutes.toString().padStart(2, '0');

                    const currentTime = `${formattedHour}:${formattedMinutes}`;
                    this.horas = horasNoFiltradas.filter(hora => {
                        return this.hourIsBigger(hora.hora, currentTime);
                    });
                } else {
                    this.horas = horasNoFiltradas;
                }
            },
            complete: () => {
                this.getBloqueosActivos();
            }
        });
    }

    getBloqueosActivos(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id_espacio = +params.get('id')
        })
        let token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        this.http.get(`${API_URI}/bloqueos/espacio/${this.id_espacio}`, {headers}).subscribe( (res) => {
            this.reqData = res
            this.bloqueos = this.reqData.data.map((obj) => {
                return {
                    start: new Date(obj.start),
                    end: new Date(obj.end)
                }
            });
            // deshabilitar horarios no disponibles
            let horasIndex = 0;
            let rangoIndex = 0;

            while (horasIndex != this.horas.length && rangoIndex != this.bloqueos.length) {
                let [hoursStart, minutesStart] = this.horas[horasIndex].hora.split(":");
                let [hoursEnd, minutesEnd] = this.sumMinutesToHour(this.horas[horasIndex].hora, this.miServicio.TIME_INTERVAL_FOR_RESERVA).split(":");

                let tempDateStart = new Date(this._selectedDate.setHours(parseInt(hoursStart, 10), parseInt(minutesStart, 10), 0, 0));
                let tempDateEnd = new Date(this._selectedDate.setHours(parseInt(hoursEnd, 10), parseInt(minutesEnd, 10), 0, 0));

                if (tempDateStart < this.bloqueos[rangoIndex].start) {
                    horasIndex++;
                } else if (tempDateEnd > this.bloqueos[rangoIndex].end) {
                    rangoIndex++;
                } else {
                    this.horas[horasIndex].is_disabled = true;
                    horasIndex++;
                }
            }
        });
    }

    getHorarioInstalacion(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id_espacio = +params.get('id')
        })
        let token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        this.http.get(`${API_URI}/instalacion/datos/${this.id_espacio}`, {headers}).subscribe({
            next: (res) => {
                this.reqData = res
                this.nombreEspacio = this.reqData.data[0].nombre;
                this.nombreInstalacion = this.reqData.data[0].nombreInstalacion;
                this.idInstalacion = this.reqData.data[0].inst_id;
            },
            complete: () => {
                this.getHorasDisponibles(new Date());
            }
        });
    }

    getReservaciones() {
        let token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        this.http.get(`${API_URI}/reservacionesActivas/espacio/${this.id_espacio}`, {headers}).subscribe(res => {
            this.reqData = res;
            this.reservaciones = this.reqData.data;
        });
    }

    reservar(dia: Date, hora_entrada: Hora, hora_salida: Hora): void {
        if (!dia || !hora_entrada) {
            alert("Selecciona un horario valido para tu reservación.");
            return;
        } else {
            if (!confirm("Seguro que quieres confirmar la reservación")){
                return ;
            }
        }

        let diaFormateado = this.datepipe.transform(dia, 'yyyy-MM-dd')
        let dateTimeEntrada = diaFormateado + " " + hora_entrada.hora;
        let dateTimeSalida = diaFormateado + " ";

        if (hora_salida) { 
            dateTimeSalida += this.sumMinutesToHour(hora_salida.hora, this.miServicio.TIME_INTERVAL_FOR_RESERVA);
        } else {
            dateTimeSalida += this.sumMinutesToHour(hora_entrada.hora, this.miServicio.TIME_INTERVAL_FOR_RESERVA);
        }

        let token = localStorage.getItem('token');
        const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json');

        const options = { headers: headers };
        const body = {
            matricula : localStorage.getItem('isAdmin') === 'false' ? localStorage.getItem('id') : null,
            num_nomina : localStorage.getItem('isAdmin') === 'true' ? localStorage.getItem('id') : null,
            id_espacio : this.id_espacio,
            hora_entrada : dateTimeEntrada,
            hora_salida : dateTimeSalida,
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
        let token = localStorage.getItem('token');
        const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json');

        const options = { headers: headers };
        const body = {
            matricula: dueno,
            encabezado: 'Reservacion Cancelada',
            texto: `Tu reservación en la ${this.nombreEspacio} en el ${this.nombreInstalacion} ha sido cancelada por un administrador.`,
            id_reservacion: id
        };
      
        this.http.delete(`${API_URI}/reservacion/delete/${id}`, {headers}).subscribe();
        this.http.post(`${API_URI}/generar/aviso`, JSON.stringify(body), options).subscribe();
        window.location.replace(this.location.path());
    }
}
