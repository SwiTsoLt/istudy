import { Injectable } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { WebRtcReducerState } from "./store/webrtc-store/webrtc.reducer";
import { WebSocketService } from "./ws.service";
import { wsEventsEnum, wsListenerEventEnum } from "./store/ws-store/ws.interface";
import * as webRtcActions from './store/webrtc-store/webrtc.actions'
import { Observable, of, take } from "rxjs";
import * as webRtcSelectors from './store/webrtc-store/webrtc.selector';
import * as webRtcEnums from './store/webrtc-store/webrtc.interface';
import { Router } from "@angular/router";
import { IPosition } from "./components/controller/controller.service";
import * as canvasActions from "./store/canvas-store/canvas.actions";

@Injectable({
    providedIn: 'root',
})
export class WebRtcService {

    private dataChannelPosition$: Observable<RTCDataChannel | null> = of(null)
    private pc$: Observable<RTCPeerConnection | null> = this.webRtcStore$.pipe(select(webRtcSelectors.selectRTCPeerConnection))

    constructor(
        private webRtcStore$: Store<WebRtcReducerState>,
        private webSocketService: WebSocketService,
        private router: Router,
        private canvasStore$: Store<CanvasState>
    ) {

    }

    public subscribeAll() {
        this.dataChannelPosition$.subscribe(console.log)

        this.webSocketService.listen(wsListenerEventEnum.startWebRtcConnection)
            .subscribe(({ roomCode }) => {
                if (roomCode) {
                    this.webRtcStore$.dispatch(webRtcActions.initWebRtcPeerConnection())
                    this.webRtcStore$.dispatch(webRtcActions.createDataChannel({ label: 'dataChannel' }))
                    this.webRtcStore$.dispatch(webRtcActions.createDataChannel({ label: 'positionChannel' }))
                    this.webRtcStore$.dispatch(webRtcActions.createOffer())
                }
            })

        this.webSocketService.listen(wsListenerEventEnum.offer)
            .subscribe(({ description }) => {
                this.webRtcStore$.dispatch(webRtcActions.initWebRtcPeerConnection())
                this.webRtcStore$.dispatch(webRtcActions.setRemoteDescription({ description }))
                this.webRtcStore$.dispatch(webRtcActions.createAnswer())
            })

        this.webSocketService.listen(wsListenerEventEnum.answer)
            .subscribe(({ description }) => {
                this.webRtcStore$.dispatch(webRtcActions.setRemoteDescription({ description }))
            })

        this.webSocketService.listen(wsListenerEventEnum.icecandidate)
            .subscribe(({ candidate }) => {
                return this.webRtcStore$.dispatch(webRtcActions.addIceCandidate({ candidate }))
            })

        this.pc$.subscribe((pc: RTCPeerConnection | null) => {
            if (pc) {
                pc.addEventListener('icecandidate', (event: RTCPeerConnectionIceEvent) => {
                    if (event.candidate) {
                        this.webSocketService.emit(wsEventsEnum.rtcData, { type: webRtcEnums.webRtcDataTypeEnum.icecandidate, candidate: event.candidate })
                    }
                })

                pc.addEventListener('datachannel', (event: RTCDataChannelEvent) => {
                    if (event.channel.label === webRtcEnums.DataChannelLabelEnum.positionChannel) {
                        this.dataChannelPosition$ = of(event.channel)
                    }


                    event.channel.addEventListener('open', (event: Event) => {
                        console.log('connect');
                        this.webRtcStore$.dispatch(webRtcActions.connectSuccess())
                    })

                    event.channel.addEventListener("message", (event) => {
                        const data: {
                            label: webRtcEnums.DataChannelLabelEnum,
                            dataType: webRtcEnums.DataChannelMessageType,
                            data: webRtcEnums.DataChannelMessageDataType
                        } = JSON.parse(event.data)

                        switch (data.label) {
                            case webRtcEnums.DataChannelLabelEnum.dataChannel:
                                switch (data.dataType) {
                                    case webRtcEnums.DataChannelDataTypeEnum.openMap:
                                        this.router.navigate([data.data])
                                        break;
                                    case webRtcEnums.DataChannelDataTypeEnum.exitMap:
                                        this.router.navigate(["/room"])
                                        break;

                                    default:
                                        break;
                                }
                                break;
                            case webRtcEnums.DataChannelLabelEnum.positionChannel:
                                switch (data.dataType) {
                                    case webRtcEnums.DataChannelPositionTypeEnum.setCameraPosition:
                                        this.canvasStore$.dispatch(canvasActions.setCameraPosition({ pos: data.data }))
                                        break;
                                
                                    default:
                                        break;
                                }
                                break;

                            default:
                                break;
                        }
                    })
                })
            }
        })
    }

    public sendData(
        label: webRtcEnums.DataChannelLabelEnum,
        dataType: webRtcEnums.DataChannelMessageType,
        data: webRtcEnums.DataChannelMessageDataType
    ): void {
        this.webRtcStore$.dispatch(webRtcActions.sendMessage({ label, dataType, data }))
    }
}
