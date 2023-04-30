import { Component } from '@angular/core';
import { MbscDatepickerOptions, setOptions , localeEs } from '@mobiscroll/angular';
import { HttpClient } from '@angular/common/http';

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

    constructor(private http: HttpClient) {
      this.tomorrow.setDate(this.today.getDate() + 1);
      this.tomorrow.setHours(22, 0, 0);
    }
    
    myInvalid = [{
        start: '2023-04-29T20:30',
        end: '2023-04-29T21:00'
    }];

    settings: MbscDatepickerOptions = {
        display: 'inline',
        controls: ['calendar', 'timegrid'],
        min: this.today,
        max: this.tomorrow,
        minTime: '06:00',
        maxTime: '22:00',
        selectMultiple: true,
    };
}
