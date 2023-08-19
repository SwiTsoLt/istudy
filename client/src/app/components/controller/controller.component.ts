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

  private sensitivity: number = 6

  public position: IPosition = {
    x: "0",
    y: "0"
  }

  ngOnInit(): void {
    this.position.x = 180 / 180 * 50 + "%"
    this.position.y = 180 / 180 * 50 + "%"

    this.subscribeToDeviceOrientation()
  }

  private subscribeToDeviceOrientation(): void {
    window.addEventListener("deviceorientation", event => {
      if (event.alpha !== null && event.beta !== null) {
        this.position.x = event.alpha / 180 * 50 + "%"
        this.position.y = event.beta / 180 * 50 + "%"
      }
    })
  }
}
