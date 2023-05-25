import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafEstanciaPromComponent } from './graf-estancia-prom.component';

describe('GrafEstanciaPromComponent', () => {
  let component: GrafEstanciaPromComponent;
  let fixture: ComponentFixture<GrafEstanciaPromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrafEstanciaPromComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrafEstanciaPromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
