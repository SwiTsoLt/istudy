import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Observable, Subscriber, forkJoin, map, take } from "rxjs";
import { selectIsReady } from "../../store/webrtc-store/webrtc.selectors";
import { selectIsOwner } from "../../store/ws-store/ws.selectors";
import { WSReducerState } from "../../store/ws-store/ws.reducer";
import { WebRtcReducerState } from "../../store/webrtc-store/webrtc.reducer";


@Injectable()
export class ConnectionGuardService implements CanActivate {
    private isReady$: Observable<boolean> = this.webRtcStore$.pipe(select(selectIsReady))
    private isOwner$: Observable<boolean> = this.wsStore$.pipe(select(selectIsOwner))

    constructor(
        private wsStore$: Store<WSReducerState>,
        private webRtcStore$: Store<WebRtcReducerState>,
        private router: Router
    ) { }

    canActivate(): Observable<boolean> {
        return forkJoin(
            this.isReady$.pipe(
                take(1)
            ),
            this.isOwner$.pipe(
                take(1),
                map(v => !v)
            )
        )
            .pipe(
                map(res => {
                    if (res.every(v => v)) {
                        return true
                    }
                    
                    this.router.navigate(['/home'])
                    return false
                })
            )
    }
}