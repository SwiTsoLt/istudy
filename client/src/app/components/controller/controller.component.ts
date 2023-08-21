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
          [this.position.beta, this.position.gamma] = [beta, gamma]
          this.webRtcService.sendPosition({ beta, gamma })
        }
      })
  }

  public toggleEnableMove(): void {
    this.isMoveEnabled = !this.isMoveEnabled 
  }
}
