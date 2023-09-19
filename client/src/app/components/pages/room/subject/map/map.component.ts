import { Component, Input } from "@angular/core";

@Component({
    selector: "app-map",
    templateUrl: "./map.component.html",
    styleUrls: ["./map.component.scss"]
})
export class MapComponent {
  @Input() title: string = "";
  @Input() linkUrl: string = "";
  @Input() imageSrc: string = "";
  @Input() disabled: boolean = false;
  @Input() isOpenMap: boolean = false;
  @Input() callback: (mapId: string) => void = () => {};
}
