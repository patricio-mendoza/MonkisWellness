import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimacionesDosComponent } from './estimaciones-dos.component';

describe('EstimacionesDosComponent', () => {
  let component: EstimacionesDosComponent;
  let fixture: ComponentFixture<EstimacionesDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimacionesDosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstimacionesDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
