import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './components/room/room.component';
import { HomeComponent } from './components/home/home.component';
import { ChooseLevelComponent } from './components/room/choose-level/choose-level.component';
import { ChooseMapComponent } from './components/room/choose-level/choose-map/choose-map.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: "full" },
  { path: 'home', component: HomeComponent },
  {
    path: 'room', component: RoomComponent, children: [
      {
        path: 'choose-level', component: ChooseLevelComponent, children: [
          { path: 'choose-map/:id', component: ChooseMapComponent }
        ]
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
