import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloquearEspacioComponent } from './bloquear-espacio.component';

describe('BloquearEspacioComponent', () => {
  let component: BloquearEspacioComponent;
  let fixture: ComponentFixture<BloquearEspacioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BloquearEspacioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloquearEspacioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
