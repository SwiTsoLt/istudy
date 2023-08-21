import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IPosition } from '../../controller/controller.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.scss']
})
export class InterfaceComponent {
  @Input() pos$: Observable<IPosition> = of({ beta: 0, gamma: 0 })
}
