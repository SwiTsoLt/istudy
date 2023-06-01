import { OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JoinDto, RtcDataDto } from './gateway.dto';
import { GatewayService, IMessage } from './gateway.service';

@WebSocketGateway()
export class GatewayController implements OnModuleInit {
  constructor(private gatewayService: GatewayService) {}

  onModuleInit() {
    this.gatewayService.init();
  }

  @SubscribeMessage('createRoom')
  handleCreateRoomEvent(@ConnectedSocket() socket: Socket) {
    const response: IMessage = this.gatewayService.createRoom(socket);
    socket.send(response);
  }

  @SubscribeMessage('removeRoom')
  handleRemoveRoomEvent(@ConnectedSocket() socket: Socket) {
    const response: IMessage = this.gatewayService.removeRoom(socket);
    socket.send(response);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoomEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() joinDto: JoinDto,
  ) {
    const response: IMessage = this.gatewayService.joinRoom(socket, joinDto);
    socket.send(response);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoomEvent(@ConnectedSocket() socket: Socket) {
    const response: IMessage = this.gatewayService.leaveRoom(socket);
    socket.send(response);
  }

  // RTC

  @SubscribeMessage('rtcData')
  handleRtcDataEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() rtcDataDto: RtcDataDto,
  ) {
    const response: IMessage = this.gatewayService.rtcData(socket, rtcDataDto);
    socket.send(response);
  }
}
