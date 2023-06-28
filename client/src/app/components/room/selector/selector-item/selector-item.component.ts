import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-selector-item',
  templateUrl: './selector-item.component.html',
  styleUrls: ['./selector-item.component.scss']
})
export class SelectorItemComponent {
  @Input() title: string = ''
  @Input() linkUrl: string = ''
  @Input() imageSrc: string = ''
  @Input() disabled: boolean = false
  @Input() isOpenMap: boolean = false
  @Input() callback: Function = () => {}
}
