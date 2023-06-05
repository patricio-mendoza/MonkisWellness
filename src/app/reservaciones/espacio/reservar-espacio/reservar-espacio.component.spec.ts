import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MbscDatepickerOptions, setOptions , localeEs } from '@mobiscroll/angular';
import { ReservarEspacioComponent } from './reservar-espacio.component';

setOptions({
  locale: localeEs,
  theme: 'ios',
  themeVariant: 'light'
});

const minDate = '2023-04-29T00:00';
const maxDate = '2023-10-29T00:00';

describe('ReservarEspacioComponent', () => {
  let component: ReservarEspacioComponent;
  let fixture: ComponentFixture<ReservarEspacioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservarEspacioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservarEspacioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
