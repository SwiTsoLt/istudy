import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IPosition } from '../../controller/controller.service';
@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.scss']
})
export class InterfaceComponent implements OnInit {

  @Input('cameraPosition$') cameraPosition$: Observable<IPosition> = of({ gamma: 0, beta: 0 });

  ngOnInit(): void {
  }  
}
