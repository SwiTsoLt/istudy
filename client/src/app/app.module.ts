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
import { reducers, metaReducers } from './reducers'

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
    StoreModule.forRoot({}, {}),
    StoreModule.forRoot(reducers, {
      metaReducers
    })
  ],
  providers: [
    WebSocketService,
    WebRtcService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
