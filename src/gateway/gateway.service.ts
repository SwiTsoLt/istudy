import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { JoinDto, RtcDataDto } from './gateway.dto';
import { WebSocketServer, WebSocketGateway } from '@nestjs/websockets';

interface IRoom {
  ownerId: string;
  clientId: string;
}

interface IRoomList {
  [key: string]: IRoom;
}

export interface IMessage {
  msg: string;
}

interface IClient {
  ownerOf: string;
  joinTo: string;
}

interface IClientList {
  [key: string]: IClient;
}

@Injectable()
@WebSocketGateway()
export class GatewayService {
  @WebSocketServer()
  private server: Server;

  private rooms: IRoomList = {};

  private clients: IClientList = {};

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

  public createRoom(socket: Socket): IMessage {
    const client: IClient = this.clients[socket.id];

    if (!!client.ownerOf.length) {
      return { msg: 'you are the author of a room' };
    }

    if (!!client.joinTo.length) {
      return { msg: 'you are already join to someone’s room' };
    }

    const roomCode: string = this.generateRoomCode();

    this.rooms[roomCode] = { ownerId: socket.id, clientId: '' };
    this.clients[socket.id].ownerOf = roomCode;

    socket.emit('successCreate', { roomCode });
    return { msg: 'room successful created' };
  }

  public removeRoom(socket: Socket): IMessage {
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
      clientSocket.emit('successLeave');
      clientSocket.send({ msg: 'success leave' });
    }

    this.clients[socket.id].ownerOf = '';
    delete this.rooms[client.ownerOf];

    socket.emit('successRemoveRoom');
    return { msg: 'room success removed' };
  }

  public joinRoom(socket: Socket, joinDto: JoinDto): IMessage {
    const client: IClient = this.clients[socket.id];

    if (this.rooms[client.ownerOf]) {
      return { msg: 'you are the author of room' };
    }

    if (!!client.joinTo.length) {
      return { msg: 'you already join to a room' };
    }

    if (!this.rooms[joinDto.roomCode]) {
      return { msg: `room '${joinDto.roomCode}' not found` };
    }

    this.rooms[joinDto.roomCode].clientId = socket.id;
    this.clients[socket.id].joinTo = joinDto.roomCode;

    socket.emit('successJoin', { roomCode: joinDto.roomCode });

    const ownerSocket: Socket = this.server.sockets.sockets.get(
      this.rooms[joinDto.roomCode]?.ownerId,
    );

    if (ownerSocket) {
      ownerSocket.emit('successJoin', { roomCode: joinDto.roomCode });
      ownerSocket.send({ msg: 'success connected' });
    }

    return { msg: 'success join' };
  }

  public leaveRoom(socket: Socket): IMessage {
    const client: IClient = this.clients[socket.id];

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
    socket.emit('successLeave');

    if (ownerSocket) {
      ownerSocket.emit('successLeave');
      ownerSocket.send({ msg: 'success leave' });
    }

    return { msg: 'success leave' };
  }

  private generateRoomCode(): string {
    let roomCode = '';

    for (let i = 0; i <= 4; i++) {
      const rand: number = Math.round(Math.random() * 9);
      roomCode += rand.toString();
    }

    return roomCode;
  }

  // RTC

  public rtcData(socket: Socket, rtcData: RtcDataDto): IMessage {
    const client = this.clients[socket.id];

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
