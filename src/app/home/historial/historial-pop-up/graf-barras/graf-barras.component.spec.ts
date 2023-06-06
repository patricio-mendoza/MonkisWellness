import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafBarrasComponent } from './graf-barras.component';

describe('GrafBarrasComponent', () => {
  let component: GrafBarrasComponent;
  let fixture: ComponentFixture<GrafBarrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrafBarrasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrafBarrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
