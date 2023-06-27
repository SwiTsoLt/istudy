import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IToast, ToastState } from '../../store/toast-store/toast.reducer';
import { selectToastList } from '../../store/toast-store/toast.selector';
@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {

  public toastList$: Observable<IToast[]> = this.toastStore$.pipe(select(selectToastList))

  constructor(
    private toastStore$: Store<ToastState>
  ) {}
}
