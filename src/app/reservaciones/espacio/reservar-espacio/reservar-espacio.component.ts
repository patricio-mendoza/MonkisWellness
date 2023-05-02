import { Component } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
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
    clicked: boolean = false;

    id_espacio: number;
    reqData: any;

    bloqueos: Bloqueo[];

    constructor(private location: Location, private datepipe: DatePipe,private route: ActivatedRoute, private http: HttpClient) {
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
        
        this.clicked = true;
        
        let formattedStartDate = this.datepipe.transform(this.selectedDate[0], 'yyyy-MM-dd HH:mm:ss')
        let formattedFinishDate = this.datepipe.transform(this.selectedDate[1], 'yyyy-MM-dd HH:mm:ss')
        console.log(formattedStartDate)
        console.log(formattedFinishDate)

        const headers = { 'Content-Type': 'application/json' };
        const options = { headers: headers };
        
        const body = {
            matricula : localStorage.getItem('isAdmin') === 'false' ? localStorage.getItem('id') : null,
            num_nomina : localStorage.getItem('isAdmin') === 'true' ? localStorage.getItem('id') : null,
            id_espacio : this.id_espacio,
            hora_entrada : formattedStartDate,
            hora_salida : formattedFinishDate,
            prioridad : localStorage.getItem('isAdmin') === 'true' ? 1 : 2,
            estatus : 1
        };

        this.http.post(`${API_URI}/reservar/espacio`, JSON.stringify(body), options).subscribe(res => {
            this.reqData = res;
            if (this.reqData.status) {
                // get most current reservation and compare to avoid conflicts
                window.location.replace(this.location.path());
            }
        });
    }
}
