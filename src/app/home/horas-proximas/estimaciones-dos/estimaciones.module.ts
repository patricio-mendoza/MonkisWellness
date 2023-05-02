import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { HoraMinutoDosComponent } from './hora-minuto-dos/hora-minuto-dos.component';
/* import { EstimacionesdosComponent } from './estimacionesdos/estimacionesdos.component';
import { EstimacionestresComponent } from './estimacionestres/estimacionestres.component'; */

@NgModule({
  declarations: [
    /* EstimacionesdosComponent,
    EstimacionestresComponent */
  
    
  
    HoraMinutoDosComponent
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