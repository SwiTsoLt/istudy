import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { JoinDto, RtcDataDto } from './gateway.dto';
import { WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import * as interfaces from '../interfaces';

@Injectable()
@WebSocketGateway()
export class GatewayService {
  @WebSocketServer()
  private server: Server;

  private rooms: interfaces.IRoomList = {};

  private clients: interfaces.IClientList = {};

  public init() {
    this.server.on('connection', (socket: Socket) => {
      this.connect(socket);

      socket.on('disconnect', () => {
        this.disconnect(socket);
      });

      socket.on('error', () => {
        this.disconnect(socket);
      });
    });
  }

  public connect(socket: Socket) {
    this.clients[socket.id] = { ownerOf: '', joinTo: '' };
  }

  public disconnect(socket: Socket) {
    const client = this.clients[socket.id];

    if (client.joinTo) {
      return this.leaveRoom(socket);
    }

    if (client.ownerOf) {
      return this.removeRoom(socket);
    }
  }

  public createRoom(socket: Socket): interfaces.IMessage {
    const client: interfaces.IClient = this.clients[socket.id];

    if (!!client.ownerOf.length) {
      return { msg: 'you are the author of a room' };
    }

    if (!!client.joinTo.length) {
      return { msg: 'you are already join to someone’s room' };
    }

    const roomCode: string = this.generateRoomCode();

    this.rooms[roomCode] = { ownerId: socket.id, clientId: '' };
    this.clients[socket.id].ownerOf = roomCode;

    socket.emit('createRoomSuccess', { roomCode });
    return { msg: 'room created success' };
  }

  public removeRoom(socket: Socket): interfaces.IMessage {
    const client = this.clients[socket.id];

    if (!client.ownerOf.length) {
      return { msg: "you don't have a room" };
    }

    if (!this.rooms[client.ownerOf]) {
      return { msg: 'room not found' };
    }

    const clientSocket: Socket = this.server.sockets.sockets.get(
      this.rooms[client.ownerOf]?.clientId,
    );

    if (clientSocket) {
      this.clients[clientSocket.id].joinTo = '';
      clientSocket.emit('leaveRoomSuccess');
      clientSocket.send({ msg: 'leave room success' });
    }

    delete this.rooms[client.ownerOf];
    this.clients[socket.id].ownerOf = '';

    socket.emit('removeRoomSuccess');
    return { msg: 'room removed success' };
  }

  public joinRoom(socket: Socket, joinDto: JoinDto): interfaces.IMessage {
    const client: interfaces.IClient = this.clients[socket.id];

    if (this.rooms[client.ownerOf]) {
      socket.emit('joinRoomError');
      return { msg: 'you are the author of room' };
    }

    if (!!client.joinTo.length) {
      socket.emit('joinRoomError');
      return { msg: 'you already join to a room' };
    }

    if (!this.rooms[joinDto.roomCode]) {
      socket.emit('joinRoomError');
      return { msg: `room '${joinDto.roomCode}' not found` };
    }

    this.rooms[joinDto.roomCode].clientId = socket.id;
    this.clients[socket.id].joinTo = joinDto.roomCode;

    const ownerSocket: Socket = this.server.sockets.sockets.get(
      this.rooms[joinDto.roomCode]?.ownerId,
    );

    if (ownerSocket) {
      ownerSocket.emit('joinRoomSuccess', { roomCode: joinDto.roomCode });
      ownerSocket.send({ msg: 'join room success' });
    }

    socket.emit('joinRoomSuccess', { roomCode: joinDto.roomCode });
    socket.emit('startWebRtcConnection', { roomCode: joinDto.roomCode });
    return { msg: 'join room success' };
  }

  public leaveRoom(socket: Socket): interfaces.IMessage {
    const client: interfaces.IClient = this.clients[socket.id];

    if (client.ownerOf.length) {
      return { msg: 'you are the author of a room' };
    }

    if (!client.joinTo.length) {
      return { msg: 'you are not joined to a room' };
    }

    const ownerSocket = this.server.sockets.sockets.get(
      this.rooms[client.joinTo].ownerId,
    );

    this.rooms[this.clients[socket.id].joinTo].clientId = '';
    this.clients[socket.id].joinTo = '';
    socket.emit('leaveRoomSuccess');

    if (ownerSocket) {
      ownerSocket.emit('leaveRoomSuccess');
      ownerSocket.send({ msg: 'leave room success' });
    }

    return { msg: 'leave room success' };
  }

  private generateRoomCode(): string {
    let roomCode = '';

    for (let i = 0; i <= 4; i++) {
      const rand: number = Math.round(Math.random() * 9);
      roomCode += rand.toString();
    }

    if (this.rooms[roomCode]) {
      return this.generateRoomCode();
    }

    return roomCode;
  }

  // RTC

  public rtcData(socket: Socket, rtcData: RtcDataDto): interfaces.IMessage {
    const client = this.clients[socket.id];

    console.log(rtcData);

    const clientSocket = !!client.ownerOf.length
      ? this.server.sockets.sockets.get(this.rooms[client.ownerOf]?.clientId)
      : this.server.sockets.sockets.get(this.rooms[client.joinTo]?.ownerId);

    if (clientSocket) {
      clientSocket.send({ msg: `remote ${rtcData.type}` });
      clientSocket.emit(rtcData.type, rtcData);
    }

    return { msg: `success send ${rtcData.type}` };
  }
}
