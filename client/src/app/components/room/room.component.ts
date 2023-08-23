import { Component, OnInit, Query } from '@angular/core';
import { WebSocketService } from '../../ws.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as WSActions from '../../store/ws-store/ws.actions'
import * as wsSelectors from '../../store/ws-store/ws.selectors';
import * as webRtcSelectors from '../../store/webrtc-store/webrtc.selector';
import { WSReducerState } from '../../store/ws-store/ws.reducer';
import { Title } from '@angular/platform-browser';
import { ToastState } from '../../store/toast-store/toast.reducer';
import { createToast } from '../../store/toast-store/toast.actions';
import { WebRtcService } from '../../webrtc.service';

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

  public isConnected$: Observable<boolean> = this.wsStore$.pipe(select(webRtcSelectors.selectIsConnected));
  public isReady$: Observable<boolean> = this.wsStore$.pipe(select(wsSelectors.selectIsReady));

  public roomCode: string = ''

  constructor(
    private wsStore$: Store<WSReducerState>,
    private toastStore$: Store<ToastState>,
    private webSocketService: WebSocketService,
    private webRtcService: WebRtcService,
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
              this.router.navigate(['/room/subject'])
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
    this.webSocketService.joinRoom(this.roomCode, this.isConnected$, this.showJoinerPopupState$, this.isReady$)
  }

  public leaveRoom() {
    this.wsStore$.dispatch(WSActions.leaveRoom())
  }

  public closeJoinerPopup() {
    this.wsStore$.dispatch(WSActions.closeJoinerPopup())
  }

  // Subscribe

  private subscribeAll() {
    // ws

    this.webSocketService.subscribeAll()

    // rtc

    this.webRtcService.subscribeAll()
  }
}
