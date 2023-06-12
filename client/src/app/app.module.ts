import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomComponent } from './components/room/room.component';
import { HomeComponent } from './components/home/home.component';
import { WebSocketService } from './ws.service';
import { WebRtcService } from './webrtc.service';
import { QRCodeModule } from 'angularx-qrcode';
import { ChooseLevelComponent } from './components/room/choose-level/choose-level.component';
import { ChooseMapComponent } from './components/room/choose-level/choose-map/choose-map.component'

@NgModule({
  declarations: [
    AppComponent,
    RoomComponent,
    HomeComponent,
    ChooseLevelComponent,
    ChooseMapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    QRCodeModule
  ],
  providers: [
    WebSocketService,
    WebRtcService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
