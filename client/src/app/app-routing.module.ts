import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './components/room/room.component';
import { HomeComponent } from './components/home/home.component';
import { SelectorComponent } from './components/room/selector/selector.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { ConnectionGuardService } from './guards/connection-guard/connection-guard.service';
import { NotfoundComponent } from './components/notfound/notfound.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'room/selector/:subjectId/:mapId', component: CanvasComponent,
    canActivate: [ConnectionGuardService]
  },
  {
    path: 'room', component: RoomComponent, children: [
      {
        path: 'selector/:subjectId', component: SelectorComponent, canActivate: [ConnectionGuardService]
      },
      {
        path: 'selector', component: SelectorComponent, canActivate: [ConnectionGuardService]
      },
    ]
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
