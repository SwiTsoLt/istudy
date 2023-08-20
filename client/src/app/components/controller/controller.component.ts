import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ControllerService } from './controller.service';

interface IPosition {
  beta: number,
  gamma: number
}

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss']
})
export class ControllerComponent implements OnInit {

  constructor(private controllerService: ControllerService) { }

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
        }
      })
  }

  public toggleEnableMove(): void {
    this.isMoveEnabled = !this.isMoveEnabled 
  }
}
