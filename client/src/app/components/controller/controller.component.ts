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
          const convertToCircle = this.convertToCircle(gamma, beta);
          
          [this.position.gamma, this.position.beta] = [convertToCircle.gamma, convertToCircle.beta]
          
          this.webRtcService.sendData(
            webRtcInterface.DataChannelLabelEnum.positionChannel,
            webRtcInterface.DataChannelPositionTypeEnum.setCameraPosition,
            { gamma: convertToCircle.gamma, beta: convertToCircle.beta }
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

  private convertToCircle(gamma: number, beta: number): IPosition {
    if (gamma === 0 || beta === 0) return { gamma, beta }

    const radius: number = Math.abs(gamma) >= Math.abs(beta) ? gamma : beta

    const alpha: number = Math.atan(beta / gamma)

    const resultBeta: number = radius * Math.sin(alpha)
    const resultGamma: number = Math.sqrt(radius ** 2 - resultBeta ** 2)

    return {
      gamma: gamma > 0 ? Math.abs(resultGamma) : -Math.abs(resultGamma),
      beta: beta > 0 ? Math.abs(resultBeta) : -Math.abs(resultBeta)
    }
  }

  public toggleEnableGrab() {
    this.isGrabEnabled = !this.isGrabEnabled
  }
}
