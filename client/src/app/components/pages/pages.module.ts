import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CanvasModule } from "./canvas/canvas.module";
import { ControllerComponent } from "./controller/controller.component";
import { HomeComponent } from "./home/home.component";
import { NotfoundComponent } from "./notfound/notfound.component";
import { RoomComponent } from "./room/room.component";
import { WebSocketService } from "../../ws.service";
import { WebRtcService } from "../../webrtc.service";
import { ControllerService } from "./controller/controller.service";
import { SubjectComponent } from "./room/subject/subject.component";
import { MapComponent } from "./room/subject/map/map.component";
import { UIModule } from "../UI/ui.module";
import { RouterModule } from "@angular/router";

@NgModule({
    declarations: [
        ControllerComponent,
        HomeComponent,
        NotfoundComponent,
        RoomComponent,
        SubjectComponent,
        MapComponent,
    ],
    imports: [
        CommonModule,
        CanvasModule,
        UIModule,
        RouterModule
    ],
    providers: [
        WebSocketService,
        WebRtcService,
        ControllerService
    ],
    exports: [
        ControllerComponent,
        HomeComponent,
        NotfoundComponent,
        RoomComponent,
        SubjectComponent,
        MapComponent,
    ]
})
export class PagesModule {}
