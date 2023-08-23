import { Component, OnInit } from '@angular/core';
import { ControllerService } from './controller.service';
import { WebRtcService } from '../../webrtc.service';
import { Router } from '@angular/router';
import * as webRtcInterface from '../../store/webrtc-store/webrtc.interface';

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
    private webRtcService: WebRtcService,
    private router: Router
  ) { }

  public isMoveEnabled: boolean = false
  public isGrabEnabled: boolean = false

  public position: IPosition = {
    beta: 0,
    gamma: 0
  }

  ngOnInit(): void {
    this.controllerService.subscribeToDeviceOrientation()
      .subscribe(({ beta, gamma }) => {
        if (this.isMoveEnabled) {
          const convertToCircle = this.convertToCircle(beta, gamma);
          [this.position.beta, this.position.gamma] = [convertToCircle.beta, convertToCircle.gamma]
          this.webRtcService.sendData(
            webRtcInterface.DataChannelLabelEnum.positionChannel,
            webRtcInterface.DataChannelPositionTypeEnum.setCameraPosition,
            { beta: convertToCircle.beta, gamma: convertToCircle.gamma }
          )
        }
      })
  }

  public exit() {
    this.router.navigate(["/room"])
    this.webRtcService.sendData(webRtcInterface.DataChannelLabelEnum.dataChannel, webRtcInterface.DataChannelDataTypeEnum.exitMap, "")
  }

  public toggleEnableMove(): void {
    this.isMoveEnabled = !this.isMoveEnabled
  }

  private convertToCircle(beta: number, gamma: number): IPosition {
    if (beta === 0 || gamma === 0) return { beta, gamma }

    const radius: number = Math.abs(beta) >= Math.abs(gamma) ? beta : gamma

    const alpha: number = Math.atan(gamma / beta)

    const resultGamma: number = radius * Math.sin(alpha)
    const resultBeta: number = Math.sqrt(radius ** 2 - resultGamma ** 2)

    return {
      beta: beta > 0 ? Math.abs(resultBeta) : -Math.abs(resultBeta),
      gamma: gamma > 0 ? Math.abs(resultGamma) : -Math.abs(resultGamma)
    }
  }

  public toggleEnableGrab() {
    this.isGrabEnabled = !this.isGrabEnabled
  }
}
