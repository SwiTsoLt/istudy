import { OnModuleInit } from "@nestjs/common";
import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { JoinDto, RtcDataDto } from "./gateway.dto";
import { GatewayService } from "./gateway.service";
import * as interfaces from "../interfaces";

@WebSocketGateway()
export class GatewayController implements OnModuleInit {
    constructor(private gatewayService: GatewayService) {}

    onModuleInit() {
        this.gatewayService.init();
    }

    @SubscribeMessage("createRoom")
    handleCreateRoomEvent(@ConnectedSocket() socket: Socket) {
        const response: interfaces.IMessage =
            this.gatewayService.createRoom(socket);

        if (response?.type) {
            socket.send(response);
        }
    }

    @SubscribeMessage("removeRoom")
    handleRemoveRoomEvent(@ConnectedSocket() socket: Socket) {
        const response: interfaces.IMessage =
            this.gatewayService.removeRoom(socket);

        if (response?.type) {
            socket.send(response);
        }
    }

    @SubscribeMessage("joinRoom")
    handleJoinRoomEvent(
        @ConnectedSocket() socket: Socket,
        @MessageBody() joinDto: JoinDto,
    ) {
        const response: interfaces.IMessage = this.gatewayService.joinRoom(
            socket,
            joinDto,
        );

        if (response?.type) {
            socket.send(response);
        }
    }

    @SubscribeMessage("leaveRoom")
    handleLeaveRoomEvent(@ConnectedSocket() socket: Socket) {
        const response: interfaces.IMessage =
            this.gatewayService.leaveRoom(socket);

        if (response?.type) {
            socket.send(response);
        }
    }

    // RTC

    @SubscribeMessage("rtcData")
    handleRtcDataEvent(
        @ConnectedSocket() socket: Socket,
        @MessageBody() rtcDataDto: RtcDataDto,
    ) {
        const response: interfaces.IMessage = this.gatewayService.rtcData(
            socket,
            rtcDataDto,
        );

        if (response?.type) {
            socket.send(response);
        }
    }
}
