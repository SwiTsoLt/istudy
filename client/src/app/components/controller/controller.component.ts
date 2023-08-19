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

  private sensitivity: number = 3

  public position: IPosition = {
    x: "0",
    y: "0"
  }

  ngOnInit(): void {
    this.subscribeToDeviceOrientation()
  }

  private subscribeToDeviceOrientation(): void {
    window.addEventListener("deviceorientation", event => {

      if (event.alpha !== null && event.beta !== null) {
        this.position.x = `calc(${this.calculatePosition(event.alpha)}% - 25px)`
        this.position.y = `calc(${this.calculatePosition(event.beta)}% - 25px)`
      }
    })
  }

  private calculatePosition(value: number): number {
    let result = value / 360 * 50
    result *= this.sensitivity

    return result > 100 ? 100 : result
  }
}
