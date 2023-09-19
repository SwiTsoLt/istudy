import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "app-notfound",
    templateUrl: "./notfound.component.html",
    styleUrls: ["./notfound.component.scss"]
})
export class NotfoundComponent implements OnInit {
    public url: string = window.location.pathname;

    constructor(
    private router: Router
    ) {}

    ngOnInit(): void {
        if (window.location.pathname.length > 10) {
            this.url = window.location.pathname.slice(0, 10) + "...";
        }
    }

    public goHome(): void {
        this.router.navigate(["/home"]);
    }
}
