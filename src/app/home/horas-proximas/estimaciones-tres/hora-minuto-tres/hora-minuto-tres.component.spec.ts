import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoraMinutoTresComponent } from './hora-minuto-tres.component';

describe('HoraMinutoTresComponent', () => {
  let component: HoraMinutoTresComponent;
  let fixture: ComponentFixture<HoraMinutoTresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoraMinutoTresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoraMinutoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
