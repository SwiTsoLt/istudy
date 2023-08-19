import { Component, OnInit } from '@angular/core';

interface IPosition {
  beta: string,
  gamma: string
}

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss']
})
export class ControllerComponent implements OnInit {

  private sensitivity: number = 5

  public position: IPosition = {
    beta: "0",
    gamma: "0"
  }

  ngOnInit(): void {
    this.subscribeToDeviceOrientation()
  }

  private subscribeToDeviceOrientation(): void {
    window.addEventListener("deviceorientation", event => {
      if (event.beta !== null && event.gamma !== null) {
        const { beta, gamma } = this.calculateAlpha(event.beta, event.gamma);
        [this.position.beta, this.position.gamma] = [beta, gamma]
      }
    })
  }

  private calculateAlpha(beta: number, gamma: number): IPosition {
    const radius = 50
    const maxRotation = 180
    const defaultBetaRotation = 70

    let [normalizeBeta, normalizeGamma] = [(beta - defaultBetaRotation) * this.sensitivity / maxRotation * radius, gamma * this.sensitivity / maxRotation * radius];
    console.log(beta, gamma, normalizeBeta, normalizeGamma);
    [normalizeBeta, normalizeGamma] = [
      normalizeBeta >= 0
        ? normalizeBeta > radius ? radius : normalizeBeta
        : normalizeBeta < -radius ? -radius : normalizeBeta,
      normalizeGamma > 0
        ? normalizeGamma > radius ? radius : normalizeGamma
        : normalizeGamma < -radius ? -radius : normalizeGamma
    ]

    return {
      beta: normalizeBeta + "%",
      gamma: normalizeGamma + "%"
    }
  }
}
