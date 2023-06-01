import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../ws.service';
import { WebRtcService } from '../../webrtc.service';
import { ISocketMessage, IRtcData, RtcDataTypeEnum, IMessage } from '../../interfaces';
import { Observable, Subscriber, map, of } from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  // Message
  public messageList: Observable<IMessage[]> = of([])

  // Status
  public isOwner: boolean = false
  public connectWsStatus: boolean = false
  public connectWebRtcStatus: boolean = false

  // Popup
  public showPopupState: boolean = false;

  // Interface
  public messageLabel: string = "";
  public roomCode: string = ""

  constructor(
    private webSocketService: WebSocketService,
    private webRtcService: WebRtcService
  ) { }

  ngOnInit(): void {
    this.webSocketService
      .listenMessage()
      .subscribe((message: ISocketMessage) => {
        this.messageLabel = message.msg
      })

    this.webSocketService.listen('successCreate').subscribe(({ roomCode }: { roomCode: string }) => {
      [this.isOwner, this.roomCode, this.showPopupState] = [true, roomCode, true]
    });
    this.webSocketService.listen('successRemoveRoom').subscribe(() => {
      [this.isOwner, this.roomCode, this.showPopupState, this.connectWsStatus, this.connectWebRtcStatus] = [false, '', false, false, false]

      this.clearMessageList()
      this.webRtcService.init()
    });
    this.webSocketService.listen('successJoin').subscribe(({ roomCode }: { roomCode: string }) => {
      [this.roomCode, this.showPopupState, this.connectWsStatus] = [roomCode, false, true]

      this.startRtcConnection()
    });
    this.webSocketService.listen('successLeave').subscribe(() => {
      [this.connectWsStatus, this.connectWebRtcStatus] = [false, false]

      !this.isOwner && (this.roomCode = '')

      this.clearMessageList()
      this.webRtcService.init()
    });
  }

  public joinRoom(roomCode: string) {
    this.webSocketService.emit('joinRoom', { roomCode })
  }

  public leaveRoom() {
    this.webSocketService.emit('leaveRoom', {})
  }

  public removeRoom() {
    if (this.isOwner) {
      return this.webSocketService.emit("removeRoom", {})
    }
  }

  public clearMessageList() {
    this.messageList = of([])
  }

  public showPopup(createRoomState: boolean) {
    if (createRoomState) {
      return this.webSocketService.emit('createRoom', {})
    }

    if (this.isOwner) {
      return this.messageLabel = 'you are the author of a room'
    }

    if (this.connectWsStatus) {
      return this.messageLabel = 'you are already join to someone’s room'
    }

    this.showPopupState = true
  }

  public closePopup() {
    if (this.isOwner) {
      return this.webSocketService.emit("removeRoom", {})
    }
    return this.showPopupState = false
  }

  // Rtc

  private startRtcConnection() {
    this.webRtcService.init()

    // subscribe

    // subscribe main

    this.webRtcService.subscribeToIceCandidate()
      .subscribe((candidate: RTCIceCandidate | undefined) => {
        this.webSocketService.emit('rtcData', { type: RtcDataTypeEnum.icecandidate, data: candidate })
      })

    this.webSocketService.listen(RtcDataTypeEnum.description)
      .subscribe((rtcData: IRtcData) => {
        if (rtcData.type === RtcDataTypeEnum.description && (rtcData?.data?.type === 'offer' || rtcData?.data?.type === 'answer')) {
          this.webRtcService.setRemoteDescription(rtcData.data)

          if (!this.webRtcService.getLocalDescription()) {
            this.webRtcService.createAnswer()
              .subscribe((description: RTCSessionDescriptionInit) => {
                this.webRtcService.setLocalDescription(description)
                this.webSocketService.emit('rtcData', { type: RtcDataTypeEnum.description, data: description })
              })
          }
        }
      })

    this.webSocketService.listen(RtcDataTypeEnum.icecandidate)
      .subscribe((rtcData: IRtcData) => {
        if (rtcData.type === RtcDataTypeEnum.icecandidate) {
          this.webRtcService.addIceCandidate(rtcData.data as undefined)
        }
      })


    // subscribe channel

    if (this.isOwner) {
      this.webRtcService.subscribeToDataChannelOpen()
        .subscribe(() => {
          this.connectWebRtcStatus = true
          this.messageLabel = 'success connect webrtc channel'
        })

      this.webRtcService.subscribeToDataChannelMessage()
        .subscribe((newMessage: string) => {
          const parserMessage: IMessage = JSON.parse(newMessage)

          this.messageList.subscribe((currentMessageList: IMessage[]) => {
            this.messageList = of([parserMessage, ...currentMessageList])
          })
        })

      this.webRtcService.subscribeToDataChannelClose()
        .subscribe(() => {
          this.connectWebRtcStatus = false
        })
    }

    // owner

    if (!this.isOwner) {
      const dataChannel: RTCDataChannel | null = this.webRtcService.addChannel('dataChannel')
      dataChannel && this.webRtcService.setDataChannel(dataChannel)

      if (dataChannel) {
        this.webRtcService.subscribeToDataChannelOpen(dataChannel)
          .subscribe(() => {
            this.connectWebRtcStatus = true
            this.messageLabel = 'success connect webrtc channel'
          })

        this.webRtcService.subscribeToDataChannelMessage(dataChannel)
          .subscribe((newMessage: string) => {
            const parserMessage: IMessage = JSON.parse(newMessage)

            this.messageList.subscribe((currentMessageList: IMessage[]) => {
              this.messageList = of([parserMessage, ...currentMessageList])
            })
          })

        this.webRtcService.subscribeToDataChannelClose(dataChannel)
          .subscribe(() => {
            this.connectWebRtcStatus = false
          })
      }

      this.webRtcService.createOffer()
        .subscribe((description: RTCSessionDescriptionInit) => {
          this.webRtcService.setLocalDescription(description)
          this.webSocketService.emit('rtcData', { type: RtcDataTypeEnum.description, data: description })
        })
    }
  }

  public sendMessage(text: string) {
    const socketId: string = this.webSocketService.getSocketId()
    const response: { newMessage?: IMessage, msg?: string } = this.webRtcService.sendMessage(socketId, text)

    this.messageList.subscribe((currentMessageList: IMessage[]) => {
      if (response.newMessage) {
        this.messageList = of([response.newMessage, ...currentMessageList])
      }
    })

    if (response.msg) {
      return this.messageLabel = response.msg
    }

    return;
  }
}
