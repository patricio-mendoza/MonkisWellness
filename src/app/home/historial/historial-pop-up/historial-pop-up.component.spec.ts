import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialPopUpComponent } from './historial-pop-up.component';

describe('HistorialPopUpComponent', () => {
  let component: HistorialPopUpComponent;
  let fixture: ComponentFixture<HistorialPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
