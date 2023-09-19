import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { WebSocketService } from "../../ws.service";
import { DataChannelLabelEnum, DataChannelMessageType, webRtcActionsEnum, webRtcDataTypeEnum } from "./webrtc.interface";
import { EMPTY, Observable, catchError, from, map, take } from "rxjs";
import { Store, select } from "@ngrx/store";
import { selectRTCPeerConnection } from "./webrtc.selector";
import { setLocalDescription } from "./webrtc.actions";
import { wsEventsEnum, wsSuccessActionsEnum } from "../ws-store/ws.interface";
import * as webRtcActions from "./webrtc.actions";
interface IDataChannelList {
    [key: string]: RTCDataChannel | null
}

@Injectable()
export class WebRtcEffects {

    private pc$: Observable<RTCPeerConnection | null> = this.store$.pipe(select(selectRTCPeerConnection));
    private dataChannelList: IDataChannelList = {};

    constructor(
        private actions$: Actions,
        private store$: Store,
        private webSocketService: WebSocketService,
    ) { }

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
                                        this.store$.dispatch(setLocalDescription({ description }));
                                        this.webSocketService.emit(wsEventsEnum.rtcData, { type: webRtcDataTypeEnum.offer, description });
                                        return EMPTY;
                                    }),
                                    catchError((err) => {
                                        console.log(err);
                                        return EMPTY;
                                    })
                                ).subscribe();
                        }
                        return ({ type: webRtcActionsEnum.empty });
                    });
                return ({ type: webRtcActionsEnum.empty });
            })
        ));

    public createDataChannel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(webRtcActionsEnum.createDataChannel),
            map(({ label }) => {
                this.pc$.pipe(
                    take(1)
                ).subscribe((pc: RTCPeerConnection | null) => {
                    if (pc) {
                        const channel = pc.createDataChannel(label);
                        this.dataChannelList[label] = channel;
                        channel?.addEventListener("open", (event: Event) => {
                            console.log("connect", event);
                            this.store$.dispatch(webRtcActions.connectSuccess());
                        });
                        channel?.addEventListener("message", this.channelHandler);
                    }
                });
                return ({ type: webRtcActionsEnum.empty });
            })
        ));

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
                                    this.store$.dispatch(setLocalDescription({ description }));
                                    this.webSocketService.emit(wsEventsEnum.rtcData, { type: webRtcDataTypeEnum.answer, description });
                                    return EMPTY;
                                }),
                                catchError((err) => {
                                    console.log(err);
                                    return EMPTY;
                                })
                            ).subscribe();
                    }
                    return ({ type: webRtcActionsEnum.empty });
                });

                return ({ type: webRtcActionsEnum.empty });
            })
        ));

    public leaveRoomSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(wsSuccessActionsEnum.leaveRoomSuccess),
            map(() => {
                return ({ type: webRtcActionsEnum.disconnectSuccess });
            })
        ));

    public removeRoomSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(wsSuccessActionsEnum.removeRoomSuccess),
            map(() => {
                return ({ type: webRtcActionsEnum.disconnectSuccess });
            })
        ));

    public sendMessage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(webRtcActionsEnum.sendMessage),
            map((message: { label: DataChannelLabelEnum, dataType: DataChannelMessageType, data: DataChannelMessageType }) => {
                this.pc$.pipe(take(1))
                    .subscribe((pc: RTCPeerConnection | null) => {
                        if (
                            pc?.connectionState === "connected" &&
                            this.dataChannelList[message.label]?.readyState === "open"
                        ) {
                            this.dataChannelList[message.label]?.send(JSON.stringify(message));
                        }
                    });
                return ({ type: webRtcActionsEnum.empty });
            })
        ));

    private channelHandler(event: unknown) {
        const target = "target" as keyof typeof event;
        const label = "label" as keyof typeof target;

        if (!event || !target || !label) return;

        switch (label) {
        case "dataChannel":
            this.dataChannelHandler(event);
            break;

        case "positionChannel":
            this.positionChannelHandler(event);
            break;

        default:
            break;
        }
    }

    private dataChannelHandler(event: unknown) {
        console.log(event);
    }

    private positionChannelHandler(event: unknown) {
        event && console.log(event["data" as keyof typeof event]);
    }
}