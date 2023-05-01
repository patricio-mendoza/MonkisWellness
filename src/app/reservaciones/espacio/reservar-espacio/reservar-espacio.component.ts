import { Component, OnInit } from '@angular/core';
import { MbscDatepickerOptions, setOptions , localeEs } from '@mobiscroll/angular';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';


const API_URI = 'http://localhost:8888/api';

interface Bloqueo {
    start: string;
    end: string;
}

setOptions({
    locale: localeEs,
    theme: 'ios',
    themeVariant: 'light'
});


@Component({
  selector: 'app-reservar-espacio',
  templateUrl: './reservar-espacio.component.html',
  styleUrls: ['./reservar-espacio.component.scss']
})
export class ReservarEspacioComponent {
    today = new Date();
    tomorrow = new Date();
    selectedDate: any = []

    invalidRequest: boolean = false;

    id_espacio: number;
    reqData: any;

    bloqueos: Bloqueo[];

    constructor(private route: ActivatedRoute, private http: HttpClient) {
      this.tomorrow.setDate(this.today.getDate() + 1);
      this.tomorrow.setHours(22, 0, 0);
    }

    ngOnInit() {
        this.getBloqueosActivos();
        this.bloqueos = [];
    }
    
    settings: MbscDatepickerOptions = {
        display: 'inline',
        controls: ['calendar', 'timegrid'],
        min: this.today,
        max: this.tomorrow,
        minTime: '06:00',
        maxTime: '22:00',
        selectMultiple: true,
    };

    getBloqueosActivos(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id_espacio = +params.get('id')
        })
        this.http.get(`${API_URI}/reservaciones/espacio/${this.id_espacio}`).subscribe(res => {
            this.reqData = res;
            this.bloqueos = this.reqData.data;
        });
    }

    reservar(): void {
        if (this.selectedDate === null || this.selectedDate[0] === null || this.selectedDate[1] === null) {
            this.invalidRequest = true;
            console.log('Invalid Request')
            return;
        }

        const mybody = {
            matricula : localStorage.getItem('id')[0] === 'A' ? localStorage.getItem('id') : null,
            num_nomina : localStorage.getItem('id')[0] !== 'A' ? localStorage.getItem('id') : null,
            id_espacio : this.id_espacio,
            hora_entrada : this.selectedDate[0],
            hora_salida : this.selectedDate[1],
            prioridad : localStorage.getItem('id')[0] === 'A' ? 2 : 1,
            estatus : 1
        }

        this.http.post(`${API_URI}/reservar/espacio`, mybody).subscribe();
    }
}
