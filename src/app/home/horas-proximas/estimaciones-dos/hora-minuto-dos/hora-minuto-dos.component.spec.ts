import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoraMinutoDosComponent } from './hora-minuto-dos.component';

describe('HoraMinutoDosComponent', () => {
  let component: HoraMinutoDosComponent;
  let fixture: ComponentFixture<HoraMinutoDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoraMinutoDosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoraMinutoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
