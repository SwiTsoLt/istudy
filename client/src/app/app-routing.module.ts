import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './components/room/room.component';
import { HomeComponent } from './components/home/home.component';
import { SubjectComponent } from './components/room/subject/subject.component';
import { MapComponent } from './components/room/subject/map/map.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: "full" },
  { path: 'home', component: HomeComponent },
  {
    path: 'room', component: RoomComponent, children: [
      {
        path: 'subject/:subjectId/:mapId', component: MapComponent
      },
      {
        path: 'subject/:subjectId', component: MapComponent
      },
      {
        path: 'subject', component: SubjectComponent
      },
    ]
  },
  // {path: "/room/:id", component: DisplayComponent},
  // {path: "/controller", component: ControllerComponent},
  // {path: "/display", component: DisplayComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
