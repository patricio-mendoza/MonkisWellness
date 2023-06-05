import { Component, Input } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';
const MAXIMO_TIEMPO_RESERVA = 90 // tiempo en minutos
const TIME_INTERVAL_FOR_RESERVA = 30 // tiempo en minutos

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

    selectedDate: Date | null;
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

    constructor(private location: Location, private datepipe: DatePipe,private route: ActivatedRoute, private http: HttpClient) {
      this.tomorrow.setDate(this.today.getDate() + 1);
      this.tomorrow.setHours(22, 0, 0);
    
      if (this.today.getHours() > 22) this.today.setHours(24);
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
        this.getBloqueosActivos();
        this.getHorarioInstalacion();

        if (this.isAdmin) {
            this.getReservaciones();
        }
    }

    selectHora(horaSeleccionada: Hora) {
        if (!this.selectedHourStart && !this.selectedHourEnd) {
            // seleccionar hora de entrada
            this.selectedHourStart = horaSeleccionada;
            horaSeleccionada.is_selected = true; 
            // deshabilitar horas que no entran en el rango de reserva disponible
            this.horas.map(hora => {
                if (this.hourIsBigger(horaSeleccionada.hora, hora.hora) || this.hourIsBigger(hora.hora, this.sumMinutesToHour(horaSeleccionada.hora, MAXIMO_TIEMPO_RESERVA))) {
                    hora.is_disabled = true;
                }
            });
        } else if (this.selectedHourStart && horaSeleccionada.is_disabled) {
            // reemplazar hora de entrada
            this.selectedHourStart.is_selected = false;
            this.selectedHourStart = horaSeleccionada;
            horaSeleccionada.is_selected = true;
            
            // borrar hora de salida
            if (this.selectedHourEnd) { 
                this.selectedHourEnd.is_selected = false;
                this.selectedHourEnd = null; 
            }

            this.horas.map(hora => {
                hora.is_disabled = this.hourIsBigger(horaSeleccionada.hora, hora.hora) || this.hourIsBigger(hora.hora, this.sumMinutesToHour(horaSeleccionada.hora, MAXIMO_TIEMPO_RESERVA));
            });
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

                this.horas.map(hora => {
                    hora.is_disabled = this.hourIsBigger(horaSeleccionada.hora, hora.hora) || this.hourIsBigger(hora.hora, this.sumMinutesToHour(horaSeleccionada.hora, MAXIMO_TIEMPO_RESERVA));
                });
            } else {
                // reemplazar hora fin
                this.selectedHourEnd.is_selected = false;
                this.selectedHourEnd = horaSeleccionada;
                this.selectedHourEnd.is_selected = true;
            }
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
        let today = new Date().getDay();

        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id_espacio = +params.get('id')
        })
        this.http.get(`${API_URI}/instalacion/datos/${this.id_espacio}`).subscribe({
            next: (res) => {
                this.reqData = res
                this.nombreEspacio = this.reqData.data[0].nombre;
                this.nombreInstalacion = this.reqData.data[0].nombreInstalacion;
                this.idInstalacion = this.reqData.data[0].inst_id;
            },
            complete: () => {
                this.http.get(`${API_URI}/instalacion/horas_disponibles/${this.idInstalacion}/${today}/${TIME_INTERVAL_FOR_RESERVA}`).subscribe(res => {
                    this.reqData = res
                    this.horas = this.reqData.data;
                });
            },
            error: (error) => {
                console.log(error)
            }
        });
    }

    getReservaciones() {
        this.http.get(`${API_URI}/reservacionesActivas/espacio/${this.id_espacio}`).subscribe(res => {
            this.reqData = res;
            this.reservaciones = this.reqData.data;
        });
    }

    reservar(): void {
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
