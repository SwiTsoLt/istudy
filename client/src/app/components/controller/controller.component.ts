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
    this.subscribeToDeviceOrientation()
  }

  private subscribeToDeviceOrientation(): void {
    window.addEventListener("deviceorientation", event => {
      if (event.alpha !== null && event.beta !== null) {
        this.position.x = this.calculateAlpha(event.alpha, event.beta)
        this.position.y = this.calculateBetta(event.alpha, event.beta)
      }
    })
  }

  private calculateAlpha(alpha: number, betta: number): string {
    const normalizePos1 = alpha / 180 * 50 // like a radius
    const normalizePos2 = betta / 180 * 50

    const diametr = normalizePos2 * 2

    const result = Math.sqrt(Math.abs(diametr - normalizePos1**2))

    console.log(result);

    return `calc(${result}%)`
  }

  private calculateBetta(alpha: number, betta: number): string {
    const normalizePos1 = alpha / 180 * 50
    const normalizePos2 = betta / 180 * 50

    const diametr = normalizePos1 * 2

    const result = Math.sqrt(Math.abs(diametr - normalizePos2**2))

    console.log(result);

    return `calc(${result}%)`
  }
}
