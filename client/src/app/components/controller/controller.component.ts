import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ControllerService } from './controller.service';
import { WebRtcService } from '../../webrtc.service';

export interface IPosition {
  beta: number,
  gamma: number
}

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss']
})
export class ControllerComponent implements OnInit {

  constructor(
    private controllerService: ControllerService,
    private webRtcService: WebRtcService
  ) { }

  public isMoveEnabled: boolean = false

  public position: IPosition = {
    beta: 0,
    gamma: 0
  }

  ngOnInit(): void {
    this.controllerService.subscribeToDeviceOrientation()
      .subscribe(({ beta, gamma }) => {
        if (this.isMoveEnabled) {
          const convertToCircle = this.convertToCircle(beta, gamma);
          console.log({ beta, gamma }, convertToCircle);
          [this.position.beta, this.position.gamma] = [convertToCircle.beta, convertToCircle.gamma]
          this.webRtcService.sendPosition({ beta: convertToCircle.beta, gamma: convertToCircle.gamma })
        }
      })
  }

  public toggleEnableMove(): void {
    this.isMoveEnabled = !this.isMoveEnabled
  }

  private convertToCircle(beta: number, gamma: number): IPosition {
    if (beta === 0 || gamma === 0) return { beta, gamma }

    let [radius, inverse]: number[] = [0, 1];

    radius = Math.abs(beta) >= Math.abs(gamma)
      ? Math.abs(beta)
      : Math.abs(gamma)

    inverse = radius > 0 ? 1 : -1

    const alpha: number = beta > gamma
      ? Math.atan(gamma / beta)
      : Math.atan(beta / gamma)
      
    const resultGamma: number = radius * Math.sin(alpha)
    const resultBeta: number = inverse * Math.sqrt(radius ** 2 - resultGamma ** 2)
    return { beta: resultBeta, gamma: resultGamma }
  }
}
