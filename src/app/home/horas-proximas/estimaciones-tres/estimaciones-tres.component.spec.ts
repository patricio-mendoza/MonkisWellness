import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimacionesTresComponent } from './estimaciones-tres.component';

describe('EstimacionesTresComponent', () => {
  let component: EstimacionesTresComponent;
  let fixture: ComponentFixture<EstimacionesTresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimacionesTresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstimacionesTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
