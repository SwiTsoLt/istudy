import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Observable, of, take } from 'rxjs';

@Component({
  selector: 'app-my-input',
  templateUrl: './my-input.component.html',
  styleUrls: ['./my-input.component.scss']
})
export class MyInputComponent {
  @Input() type: string = ''
  @Input() placeholder: string = ''
  @Input() maxLength: number = 0
  @Input() inputCallback: Function = () => { }
  @Input() enterCallback: Function = () => { }

  @ViewChild('myInput') myInputRef: ElementRef<HTMLInputElement> | null = null;

  public inputHandler(event: any) {
    if (this.myInputRef?.nativeElement) {
      if (['e', 'E'].includes(event.data)) {
        this.myInputRef.nativeElement.value = ''
      }
      
      const val = this.myInputRef.nativeElement.value

      if (this.myInputRef && val.length > this.maxLength) {
        const newVal = val.slice(0, this.maxLength)
        this.myInputRef.nativeElement.value = newVal
      }

      this.inputCallback(this.myInputRef.nativeElement.value)
    }
  }
}
