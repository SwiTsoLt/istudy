import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CanvasComponent } from "./canvas.component";
import { InterfaceComponent } from "./interface/interface.component";

@NgModule({
    declarations: [
        CanvasComponent,
        InterfaceComponent,
    ],
    imports: [
        CommonModule
    ],
    exports: []
})
export class CanvasModule { }
