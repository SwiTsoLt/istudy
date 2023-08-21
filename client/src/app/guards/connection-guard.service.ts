import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Observable, map, take } from "rxjs";
import { selectIsConnected } from "../store/webrtc-store/webrtc.selector";
import { WebRtcReducerState } from "../store/webrtc-store/webrtc.reducer";


@Injectable()
export class ConnectionGuardService implements CanActivate {
    private isConnected$: Observable<boolean> = this.webRtcStore$.pipe(select(selectIsConnected))

    constructor(
        private webRtcStore$: Store<WebRtcReducerState>,
        private router: Router
    ) { }

    canActivate(): Observable<boolean> {
        return this.isConnected$.pipe(
            take(1),
            map(isConnected => {
                if (isConnected) {
                    return true
                }

                this.router.navigate(['/home'])
                return false
            })
        )

    }
}