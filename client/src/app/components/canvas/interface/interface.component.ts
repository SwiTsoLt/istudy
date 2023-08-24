import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPosition } from '../../controller/controller.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.scss']
})
export class InterfaceComponent implements OnInit {
  @Input() pos$: Observable<IPosition> = of({ gamma: 0, beta: 0 })

  public windowWidth: number = window.innerWidth
  public windowHeight: number = window.innerHeight

  ngOnInit(): void {
    window.addEventListener("resize", () => {
      this.windowWidth = window.innerWidth + 200 // + 200 to fix paddings
      this.windowHeight = window.innerHeight
    })
  }
}
