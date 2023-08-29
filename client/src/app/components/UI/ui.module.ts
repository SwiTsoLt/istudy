import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { MyButtonComponent } from './my-button/my-button.component';
import { MyInputComponent } from './my-input/my-input.component';
import { ToastComponent } from './toast/toast.component';
import { ToastItemComponent } from './toast/toast-item/toast-item.component';
import { QRCodeComponent, QRCodeModule } from 'angularx-qrcode';



@NgModule({
  declarations: [
    LoaderComponent,
    MyButtonComponent,
    MyInputComponent,
    ToastComponent,
    ToastItemComponent,
  ],
  imports: [
    CommonModule,
    QRCodeModule
  ],
  exports: [
    LoaderComponent,
    MyButtonComponent,
    MyInputComponent,
    ToastComponent,
    ToastItemComponent,
    QRCodeComponent
  ]
})
export class UIModule { }
