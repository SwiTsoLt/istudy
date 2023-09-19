import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Observable, map, take } from "rxjs";
import { selectIsOwner } from "../store/ws-store/ws.selectors";
import { WSReducerState } from "../store/ws-store/ws.reducer";


@Injectable()
export class OwnerGuardService implements CanActivate {
    private isOwner$: Observable<boolean> = this.wsStore$.pipe(select(selectIsOwner));

    constructor(
        private wsStore$: Store<WSReducerState>,
        private router: Router
    ) { }

    canActivate(): Observable<boolean> {
        return this.isOwner$.pipe(
            take(1),
            map(isOwner => {
                if (isOwner) {
                    return true;
                }

                this.router.navigate(["/home"]);
                return false;
            })
        );
    }
}