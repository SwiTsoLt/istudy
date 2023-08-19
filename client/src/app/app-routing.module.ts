import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './components/room/room.component';
import { HomeComponent } from './components/home/home.component';
import { SelectorComponent } from './components/room/selector/selector.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { OwnerGuardService } from './guards/owner-guard.service';
import { ConnectionGuardService } from './guards/connection-guard.service';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { JoinerGuardService } from './guards/joiner-guard.service';
import { ControllerComponent } from './components/controller/controller.component';

// ConnectionGuardService, OwnerGuardService

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'room/selector/:subjectId/:mapId', component: CanvasComponent,
    canActivate: [ConnectionGuardService, OwnerGuardService]
  },
  {
    path: 'room', component: RoomComponent, children: [
      {
        path: 'selector/:subjectId',
        component: SelectorComponent,
        canActivate: [ConnectionGuardService, JoinerGuardService]
      },
      {
        path: 'selector',
        component: SelectorComponent,
        canActivate: [ConnectionGuardService, JoinerGuardService]
      },
    ]
  },
  {
    path: 'controller',
    component: ControllerComponent,
    // canActivate: [ConnectionGuardService, JoinerGuardService]
  },
  {
    path: '**',
    component: NotfoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
