import { Component, OnInit } from '@angular/core';

interface IPosition {
  x: string,
  y: string
}

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss']
})
export class ControllerComponent implements OnInit {

  public position: IPosition = { x: "0", y: "0" }

  ngOnInit(): void {
    this.subscribeToDeviceOrientation()
  }

  private subscribeToDeviceOrientation(): void {
    window.addEventListener("deviceorientation", event => {

      if (event.alpha !== null && event.beta !== null) {
        this.position.x = `calc(${event.alpha / 360 * 50}% - 25px)`
        this.position.y = `calc(${event.beta / 360 * 50}% - 25px)`
      }
    })
  }
}
