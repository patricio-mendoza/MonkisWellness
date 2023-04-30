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

    id_espacio: number;
    reqData: any;

    bloqueos: Bloqueo[];

    constructor(private route: ActivatedRoute, private http: HttpClient) {
      this.tomorrow.setDate(this.today.getDate() + 1);
      this.tomorrow.setHours(22, 0, 0);
    }

    ngOnInit() {
        this.getBloqueosActivos();
        this.bloqueos = [{start: '2023-04-29T20:30', end: '2023-04-29T21:30'}];
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
}
