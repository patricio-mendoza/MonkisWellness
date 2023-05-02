import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoraMinutoComponent } from './hora-minuto.component';

describe('HoraMinutoComponent', () => {
  let component: HoraMinutoComponent;
  let fixture: ComponentFixture<HoraMinutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoraMinutoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoraMinutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
