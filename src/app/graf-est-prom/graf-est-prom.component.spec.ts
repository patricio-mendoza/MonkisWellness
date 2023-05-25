import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafEstPromComponent } from './graf-est-prom.component';

describe('GrafEstPromComponent', () => {
  let component: GrafEstPromComponent;
  let fixture: ComponentFixture<GrafEstPromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrafEstPromComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrafEstPromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
