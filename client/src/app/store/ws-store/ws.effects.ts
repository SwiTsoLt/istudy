import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { WebSocketService } from "../../ws.service";
import { wsActionsEnum, wsErrorActionsEnum, wsEventsEnum, wsListenerEventEnum, wsSuccessActionsEnum } from "./ws.interface"
import { EMPTY, of } from "rxjs";
import { catchError, exhaustMap, map, switchMap, take } from "rxjs/operators";

@Injectable()
export class WSEffects {

    public createRoom$ = createEffect(() =>
        this.actions$.pipe(
            ofType(wsActionsEnum.createRoom),
            exhaustMap(() => {
                this.webSocketService.emit(wsEventsEnum.createRoom, {})
                return EMPTY
            }),
            catchError(() => of({ type: wsErrorActionsEnum.createRoomError }))
        ))

    public removeRoom$ = createEffect(() =>
        this.actions$.pipe(
            ofType(wsActionsEnum.removeRoom),
            exhaustMap(() => {
                this.webSocketService.emit(wsEventsEnum.removeRoom, {})
                return EMPTY
            }),
            catchError(() => of({ type: wsErrorActionsEnum.removeRoomError }))
        ))

    public joinRoom$ = createEffect(() =>
        this.actions$.pipe(
            ofType(wsActionsEnum.joinRoom),
            exhaustMap(({ roomCode }) => {
                this.webSocketService.emit(wsEventsEnum.joinRoom, { roomCode })
                return EMPTY
            }),
            catchError(() => of({ type: wsErrorActionsEnum.joinRoomError }))
        ))

    public leaveRoom$ = createEffect(() => 
    this.actions$.pipe(
        ofType(wsActionsEnum.leaveRoom),
        exhaustMap(() => {
            this.webSocketService.emit(wsEventsEnum.leaveRoom, {})
            return EMPTY
        }),
        catchError(() => of({ type: wsErrorActionsEnum.leaveRoomError }))
    ))

    constructor(
        private actions$: Actions,
        private webSocketService: WebSocketService
    ) { }
}