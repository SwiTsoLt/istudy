import { Component, Input } from "@angular/core";

@Component({
    selector: "app-my-button",
    templateUrl: "./my-button.component.html",
    styleUrls: ["./my-button.component.scss"]
})
export class MyButtonComponent {
  @Input() title: string = "";
  @Input() callback: () => void = () => {};
}
