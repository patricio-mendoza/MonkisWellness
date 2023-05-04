import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAforoComponent } from './editar-aforo.component';

describe('EditarAforoComponent', () => {
  let component: EditarAforoComponent;
  let fixture: ComponentFixture<EditarAforoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarAforoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarAforoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
