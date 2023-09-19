import { Component, Input, OnInit } from "@angular/core";
import { IToast, ToastState } from "../../../../store/toast-store/toast.reducer";
import { Store } from "@ngrx/store";
import { removeToast } from "../../../../store/toast-store/toast.actions";

@Component({
    selector: "app-toast-item",
    templateUrl: "./toast-item.component.html",
    styleUrls: ["./toast-item.component.scss"]
})
export class ToastItemComponent implements OnInit {
  @Input() public toast: IToast = { type: "notify", text: "" };
  @Input() public index: number = 0;

  constructor(
    private toastStore$: Store<ToastState>
  ) { }

  ngOnInit(): void {
      setTimeout(() => {
          this.toastStore$.dispatch(removeToast({ toastIndex: this.index }));
      }, 5000);
  }

  public removeToast(): void {
      this.toastStore$.dispatch(removeToast({ toastIndex: this.index }));
  }
}
