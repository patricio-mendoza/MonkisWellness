import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { HoraMinutoTresComponent } from './hora-minuto-tres/hora-minuto-tres.component';

/* import { EstimacionesdosComponent } from './estimacionesdos/estimacionesdos.component';
import { EstimacionestresComponent } from './estimacionestres/estimacionestres.component'; */

@NgModule({
  declarations: [
    /* EstimacionesdosComponent,
    EstimacionestresComponent */
  
    
  
    HoraMinutoTresComponent
  ],
  imports: [
    
    CommonModule,
    NgCircleProgressModule.forRoot()
  ],
  exports: [
    NgCircleProgressModule
  ]
})
export class EstimacionesModule { }