import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from './canvas.component';
import { InterfaceComponent } from './interface/interface.component';
import { MyButtonComponent } from '../my-button/my-button.component';



@NgModule({
  declarations: [
    CanvasComponent,
    InterfaceComponent,
    MyButtonComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [MyButtonComponent]
})
export class CanvasModule { }
