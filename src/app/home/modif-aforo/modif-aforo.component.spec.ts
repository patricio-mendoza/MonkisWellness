import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifAforoComponent } from './modif-aforo.component';

describe('ModifAforoComponent', () => {
  let component: ModifAforoComponent;
  let fixture: ComponentFixture<ModifAforoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifAforoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifAforoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
