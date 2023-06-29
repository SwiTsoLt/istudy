import { Component, OnInit, Query } from '@angular/core';
import { WebSocketService } from '../../ws.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable, catchError, forkJoin, take } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as WSActions from '../../store/ws-store/ws.actions'
import * as webRtcActions from '../../store/webrtc-store/webrtc.actions'
import * as wsSelectors from '../../store/ws-store/ws.selectors';
import { wsEventsEnum, wsListenerEventEnum } from '../../store/ws-store/ws.interface';
import { DataChannelDataTypeEnum, DataChannelLabelEnum, webRtcDataTypeEnum } from '../../store/webrtc-store/webrtc.interface';
import * as webRtcSelectors from '../../store/webrtc-store/webrtc.selectors';
import { WSReducerState } from '../../store/ws-store/ws.reducer';
import { WebRtcReducerState } from '../../store/webrtc-store/webrtc.reducer';
import { Title } from '@angular/platform-browser';
import { ToastState } from '../../store/toast-store/toast.reducer';
import { createToast } from '../../store/toast-store/toast.actions';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {

  public messageLabel$: Observable<string> = this.wsStore$.pipe(select(wsSelectors.selectMessageLabel));
  public roomCode$: Observable<string> = this.wsStore$.pipe(select(wsSelectors.selectRoomCode));
  public showOwnerPopupState$: Observable<boolean> = this.wsStore$.pipe(select(wsSelectors.selectShowOwnerPopupState))
  public showJoinerPopupState$: Observable<boolean> = this.wsStore$.pipe(select(wsSelectors.selectShowJoinerPopupState))
  public inviteQrCodeUrl$: Observable<string> = this.wsStore$.pipe(select(wsSelectors.selectInviteQrCodeUrl));
  public isOwner$: Observable<boolean> = this.wsStore$.pipe(select(wsSelectors.selectIsOwner));

  private pc$: Observable<RTCPeerConnection | null> = this.webRtcStore$.pipe(select(webRtcSelectors.selectRTCPeerConnection))
  public isConnected$: Observable<boolean> = this.wsStore$.pipe(select(webRtcSelectors.selectIsConnected));
  public isReady$: Observable<boolean> = this.wsStore$.pipe(select(wsSelectors.selectIsReady));

  public roomCode: string = ''

  private reconnectCounter: number = 0

  constructor(
    private wsStore$: Store<WSReducerState>,
    private webRtcStore$: Store<WebRtcReducerState>,
    private toastStore$: Store<ToastState>,
    private webSocketService: WebSocketService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('IStudy - Комната')

    this.subscribeAll()
    this.webSocketService
      .listenMessage()
      .subscribe(({ type, msg }) => {
        this.wsStore$.dispatch(WSActions.newMessage({ msg }))
        this.toastStore$.dispatch(createToast({ toast: { type, text: msg } }))
      })

    this.isConnected$
      .subscribe(isConnected => {
        this.isOwner$
          .pipe(take(1))
          .subscribe(isOwner => {
            if (isConnected && !isOwner) {
              this.router.navigate(['/room/selector'])
            } else if (!isConnected && isOwner) {
              this.wsStore$.dispatch(WSActions.openOwnerPopup())
            }
          })
      })

    this.route.queryParams
      .subscribe((query) => {
        if (query['roomCode']?.length) {
          this.roomCode = query['roomCode']
          this.joinRoom()
        }
      })
  }

  public setRoomCode(code: any) {
    this.roomCode = code
  }

  public create() {
    this.wsStore$.dispatch(WSActions.createRoom())
  }

  public removeRoom() {
    this.wsStore$.dispatch(WSActions.removeRoom())
  }

  public showJoinerPopup() {
    this.wsStore$.dispatch(WSActions.openJoinerPopup())
  }

  public joinRoom() {
    this.wsStore$.dispatch(WSActions.joinRoom({ roomCode: this.roomCode }))

    setTimeout(() => {
      forkJoin(
        this.isConnected$.pipe(take(1)),
        this.showJoinerPopupState$.pipe(take(1)),
        this.isReady$.pipe(take(1))
      )
        .subscribe(([isConnected, showJoinerPopupState, isReady]) => {
          if (isConnected) return;
          if (isReady) return;
          if (!showJoinerPopupState) return;
          if (this.reconnectCounter >= 3) {
            this.toastStore$.dispatch(createToast({ toast: { type: 'error', text: 'Переподключение не удалось' } }))
            this.wsStore$.dispatch(WSActions.joinRoomError())
            return;
          }

          this.toastStore$.dispatch(createToast({ toast: { type: 'error', text: 'Ошибка подключения' } }))

          setTimeout(() => {
            this.toastStore$.dispatch(createToast({ toast: { type: 'notify', text: 'Переподключение' } }))
            this.joinRoom()
          }, 1000)

          this.reconnectCounter += 1
        })
    }, 5000)
  }

  public leaveRoom() {
    this.wsStore$.dispatch(WSActions.leaveRoom())
  }

  public closeJoinerPopup() {
    this.wsStore$.dispatch(WSActions.closeJoinerPopup())
  }

  // Subscribe

  private subscribeHandler(
    listenerName: string,
    successFunction: Function,
    errorFunction: Function,
    withRoomCode: boolean
  ) {
    this.webSocketService.listen(listenerName)
      .pipe(
        catchError(() => {
          this.wsStore$.dispatch(errorFunction())
          return EMPTY
        })
      ).subscribe((data) => {
        if (withRoomCode) {
          if (!data?.roomCode) {
            return this.wsStore$.dispatch(errorFunction())
          }

          return this.wsStore$.dispatch(successFunction({ roomCode: data.roomCode }))
        }
        return this.wsStore$.dispatch(successFunction())
      })
  }

  private subscribeAll() {
    // ws

    this.subscribeHandler(wsListenerEventEnum.createRoomSuccess, WSActions.createRoomSuccess, WSActions.createRoomError, true)
    this.subscribeHandler(wsListenerEventEnum.createRoomError, WSActions.createRoomError, WSActions.createRoomError, false)
    this.subscribeHandler(wsListenerEventEnum.removeRoomSuccess, WSActions.removeRoomSuccess, WSActions.removeRoomError, false)
    this.subscribeHandler(wsListenerEventEnum.removeRoomError, WSActions.removeRoomError, WSActions.removeRoomError, false)
    this.subscribeHandler(wsListenerEventEnum.joinRoomSuccess, WSActions.joinRoomSuccess, WSActions.joinRoomError, true)
    this.subscribeHandler(wsListenerEventEnum.joinRoomError, WSActions.joinRoomError, WSActions.joinRoomError, false)
    this.subscribeHandler(wsListenerEventEnum.leaveRoomSuccess, WSActions.leaveRoomSuccess, WSActions.leaveRoomError, false)
    this.subscribeHandler(wsListenerEventEnum.leaveRoomError, WSActions.leaveRoomError, WSActions.leaveRoomError, false)

    // rtc

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
            this.webSocketService.emit(wsEventsEnum.rtcData, { type: webRtcDataTypeEnum.icecandidate, candidate: event.candidate })
          }
        })

        pc.addEventListener('datachannel', (event: RTCDataChannelEvent) => {
          event.channel.addEventListener('open', (event: Event) => {
            console.log('connect');
            this.webRtcStore$.dispatch(webRtcActions.connectSuccess())
          })

          event.channel.addEventListener("message", (event) => {
            const data = JSON.parse(event.data)
            if (data.label === DataChannelLabelEnum.dataChannel) {
              if (data.messageType === DataChannelDataTypeEnum.openMap) {
                this.router.navigate([data.data])
              }
            }
          })
        })
      }
    })
  }
}
