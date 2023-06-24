import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { WebSocketService } from "../../ws.service";
import { webRtcActionsEnum, webRtcDataTypeEnum } from "./webrtc.interface";
import { EMPTY, Observable, catchError, from, map, of, take } from "rxjs";
import { Store, select } from "@ngrx/store";
import { selectRTCPeerConnection } from "./webrtc.selectors";
import { setLocalDescription } from "./webrtc.actions";
import { wsActionsEnum, wsEventsEnum, wsListenerEventEnum, wsSuccessActionsEnum } from "../ws-store/ws.interface";
import * as webRtcActions from './webrtc.actions'


@Injectable()
export class WebRtcEffects {

    private pc$: Observable<RTCPeerConnection | null> = this.store$.pipe(select(selectRTCPeerConnection))

    public createOffer$ = createEffect(() =>
        this.actions$.pipe(
            ofType(webRtcActionsEnum.createOffer),
            map(() => {
                this.pc$
                    .pipe(
                        take(1)
                    )
                    .subscribe((pc: RTCPeerConnection | null) => {
                        if (pc) {
                            from(pc.createOffer())
                                .pipe(
                                    take(1),
                                    map((description: RTCSessionDescriptionInit) => {
                                        this.store$.dispatch(setLocalDescription({ description }))
                                        this.webSocketService.emit(wsEventsEnum.rtcData, { type: webRtcDataTypeEnum.offer, description })
                                        return EMPTY
                                    }),
                                    catchError((err) => {
                                        console.log(err);
                                        return EMPTY
                                    })
                                ).subscribe()
                        }
                        return ({ type: webRtcActionsEnum.empty })
                    })
                return ({ type: webRtcActionsEnum.empty })
            })
        ))

    public createDataChannel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(webRtcActionsEnum.createDataChannel),
            map(({ label }) => {
                this.pc$.pipe(
                    take(1)
                ).subscribe((pc: RTCPeerConnection | null) => {
                    if (pc) {
                        const channel = pc.createDataChannel(label)
                        channel?.addEventListener('open', (event: Event) => {
                            console.log('connect');
                            this.store$.dispatch(webRtcActions.connectSuccess())
                        })
                        channel?.addEventListener('message', (event: MessageEvent) => {
                            console.log(event.data);
                        })
                    }
                })
                return ({ type: webRtcActionsEnum.empty })
            })
        ))

    public createAnswer$ = createEffect(() =>
        this.actions$.pipe(
            ofType(webRtcActionsEnum.createAnswer),
            map(() => {
                this.pc$.subscribe((pc: RTCPeerConnection | null) => {
                    if (pc) {
                        from(pc.createAnswer())
                            .pipe(
                                take(1),
                                map((description: RTCSessionDescriptionInit) => {
                                    this.store$.dispatch(setLocalDescription({ description }))
                                    this.webSocketService.emit(wsEventsEnum.rtcData, { type: webRtcDataTypeEnum.answer, description })
                                    return EMPTY
                                }),
                                catchError((err) => {
                                    console.log(err);
                                    return EMPTY
                                })
                            ).subscribe()
                    }
                    return ({ type: webRtcActionsEnum.empty })
                })

                return ({ type: webRtcActionsEnum.empty })
            })
        ))

    public leaveRoomSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(wsSuccessActionsEnum.leaveRoomSuccess),
            map(() => {
                return ({ type: webRtcActionsEnum.disconnectSuccess })
            })
        ))

    public removeRoomSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(wsSuccessActionsEnum.removeRoomSuccess),
            map(() => {
                return ({ type: webRtcActionsEnum.disconnectSuccess })
            })
        ))

    constructor(
        private actions$: Actions,
        private store$: Store,
        private webSocketService: WebSocketService
    ) { }
}