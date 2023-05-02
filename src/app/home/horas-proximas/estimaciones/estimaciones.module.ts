import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { HoraMinutoComponent } from './hora-minuto/hora-minuto.component';

/* import { EstimacionesdosComponent } from './estimacionesdos/estimacionesdos.component';
import { EstimacionestresComponent } from './estimacionestres/estimacionestres.component'; */

@NgModule({
  declarations: [
    /* EstimacionesdosComponent,
    EstimacionestresComponent */
  
    
  
    HoraMinutoComponent
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
