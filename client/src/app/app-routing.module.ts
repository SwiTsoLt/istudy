import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RoomComponent } from "./components/pages/room/room.component";
import { HomeComponent } from "./components/pages/home/home.component";
import { SubjectComponent } from "./components/pages/room/subject/subject.component";
import { CanvasComponent } from "./components/pages/canvas/canvas.component";
// import { OwnerGuardService } from "./guards/owner-guard.service";
// import { ConnectionGuardService } from "./guards/connection-guard.service";
import { NotfoundComponent } from "./components/pages/notfound/notfound.component";
// import { JoinerGuardService } from "./guards/joiner-guard.service";
import { ControllerComponent } from "./components/pages/controller/controller.component";

// ConnectionGuardService, OwnerGuardService

const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    {
        path: "room/subject/:subjectId/:mapId", component: CanvasComponent,
    // canActivate: [ConnectionGuardService, OwnerGuardService]
    },
    {
        path: "room", component: RoomComponent, children: [
            {
                path: "subject/:subjectId",
                component: SubjectComponent,
                // canActivate: [ConnectionGuardService, JoinerGuardService]
            },
            {
                path: "subject",
                component: SubjectComponent,
                // canActivate: [ConnectionGuardService, JoinerGuardService]
            },
        ]
    },
    {
        path: "controller",
        component: ControllerComponent,
    // canActivate: [ConnectionGuardService, JoinerGuardService]
    },
    {
        path: "**",
        component: NotfoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
