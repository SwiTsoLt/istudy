import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomComponent } from './components/room/room.component';
import { HomeComponent } from './components/home/home.component';
import { WebSocketService } from './ws.service';
import { WebRtcService } from './webrtc.service';
import { QRCodeModule } from 'angularx-qrcode';
import { SubjectComponent } from './components/room/subject/subject.component';
import { MapComponent } from './components/room/subject/map/map.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './store/index'
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects'
import { WSEffects } from './store/ws-store/ws.effects'
import { WebRtcEffects } from './store/webrtc-store/webrtc.effects';
import { ConnectionGuardService } from './guards/connection-guard.service';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { ToastComponent } from './components/toast/toast.component';
import { ToastItemComponent } from './components/toast/toast-item/toast-item.component';
import { LoaderComponent } from './components/loader/loader.component';
import { JoinerGuardService } from './guards/joiner-guard.service';
import { OwnerGuardService } from './guards/owner-guard.service';
import { MyInputComponent } from './components/my-input/my-input.component';
import { CanvasModule } from './components/canvas/canvas.module';
import { ControllerComponent } from './components/controller/controller.component';
import { ControllerService } from './components/controller/controller.service';

@NgModule({
  declarations: [
    AppComponent,
    RoomComponent,
    HomeComponent,
    SubjectComponent,
    MapComponent,
    NotfoundComponent,
    ToastComponent,
    ToastItemComponent,
    LoaderComponent,
    MyInputComponent,
    ControllerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    QRCodeModule,
    FormsModule,
    CanvasModule,
    StoreModule.forRoot(reducers, {
      metaReducers
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      features: {
        pause: false,
        lock: true,
        persist: true
      }
    }),
    EffectsModule.forRoot([WSEffects, WebRtcEffects])
  ],
  providers: [
    WebSocketService,
    WebRtcService,
    ConnectionGuardService,
    OwnerGuardService,
    JoinerGuardService,
    ControllerService
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
