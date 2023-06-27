import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomComponent } from './components/room/room.component';
import { HomeComponent } from './components/home/home.component';
import { WebSocketService } from './ws.service';
import { WebRtcService } from './webrtc.service';
import { QRCodeModule } from 'angularx-qrcode';
import { SelectorComponent } from './components/room/selector/selector.component';
import { SelectorItemComponent } from './components/room/selector/selector-item/selector-item.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './store/index'
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects'
import { WSEffects } from './store/ws-store/ws.effects'
import { WebRtcEffects } from './store/webrtc-store/webrtc.effects';
import { CanvasComponent } from './components/canvas/canvas.component';
import { ConnectionGuardService } from './guards/connection-guard/connection-guard.service';
import { InterfaceComponent } from './components/canvas/interface/interface.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { ToastComponent } from './components/toast/toast.component';
import { ToastItemComponent } from './components/toast/toast-item/toast-item.component';

@NgModule({
  declarations: [
    AppComponent,
    RoomComponent,
    HomeComponent,
    SelectorComponent,
    SelectorItemComponent,
    CanvasComponent,
    InterfaceComponent,
    NotfoundComponent,
    ToastComponent,
    ToastItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    QRCodeModule,
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
    ConnectionGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
