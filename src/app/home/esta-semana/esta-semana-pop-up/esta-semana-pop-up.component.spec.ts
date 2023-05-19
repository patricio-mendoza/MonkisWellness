import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstaSemanaPopUpComponent } from './esta-semana-pop-up.component';

describe('EstaSemanaPopUpComponent', () => {
  let component: EstaSemanaPopUpComponent;
  let fixture: ComponentFixture<EstaSemanaPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstaSemanaPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstaSemanaPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
