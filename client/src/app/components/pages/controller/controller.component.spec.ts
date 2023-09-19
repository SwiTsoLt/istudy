import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ControllerComponent } from "./controller.component";

describe("ControllerComponent", () => {
    let component: ControllerComponent;
    let fixture: ComponentFixture<ControllerComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ControllerComponent]
        });
        fixture = TestBed.createComponent(ControllerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
