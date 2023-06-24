import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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

@NgModule({
  declarations: [
    AppComponent,
    RoomComponent,
    HomeComponent,
    SubjectComponent,
    MapComponent,
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
    EffectsModule.forRoot([WSEffects, WebRtcEffects]),
  ],
  providers: [
    WebSocketService,
    WebRtcService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
