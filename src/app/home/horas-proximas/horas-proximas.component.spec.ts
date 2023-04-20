import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorasProximasComponent } from './horas-proximas.component';

describe('HorasProximasComponent', () => {
  let component: HorasProximasComponent;
  let fixture: ComponentFixture<HorasProximasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorasProximasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorasProximasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
