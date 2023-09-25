import { Injectable } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { JoinDto, RtcDataDto, messageEnum } from "./gateway.dto";
import { WebSocketServer, WebSocketGateway } from "@nestjs/websockets";
import * as interfaces from "../interfaces";

@Injectable()
@WebSocketGateway()
export class GatewayService {
  @WebSocketServer()
    private server: Server;

  private rooms: interfaces.IRoomList = {};

  private clients: interfaces.IClientList = {};

  public init() {
      try {
          this.server.on("connection", (socket: Socket) => {
              this.connect(socket);

              console.log(`connect ${socket.id}`);

              socket.on("disconnect", () => {
                  this.disconnect(socket);
              });

              socket.on("error", () => {
                  this.disconnect(socket);
              });
          });
      } catch (err) {
          console.log(err);
          return { type: "error", msg: messageEnum.somethingWentWrong };
      }
  }

  public connect(socket: Socket) {
      try {
          this.clients[socket.id] = { ownerOf: "", joinTo: "" };
      } catch (err) {
          console.log(err);
          return { type: "error", msg: messageEnum.somethingWentWrong };
      }
  }

  public disconnect(socket: Socket) {
      try {
          const client = this.clients[socket.id];

          if (client.joinTo) {
              return this.leaveRoom(socket);
          }

          if (client.ownerOf) {
              return this.removeRoom(socket);
          }
      } catch (err) {
          console.log(err);
          return { type: "error", msg: messageEnum.somethingWentWrong };
      }
  }

  public createRoom(socket: Socket): interfaces.IMessage {
      try {
          const client: interfaces.IClient = this.clients[socket.id];

          if (client.ownerOf.length) {
              return { type: "error", msg: messageEnum.alreadyAuthor };
          }

          if (client.joinTo.length) {
              return { type: "error", msg: messageEnum.alreadyJoin };
          }

          const roomCode: string = this.generateRoomCode();

          this.rooms[roomCode] = { ownerId: socket.id, clientId: "" };
          this.clients[socket.id].ownerOf = roomCode;

          socket.emit("createRoomSuccess", { roomCode });
          return { type: "success", msg: messageEnum.createRoomSuccess };
      } catch (err) {
          console.log(err);
          return { type: "error", msg: messageEnum.somethingWentWrong };
      }
  }

  public removeRoom(socket: Socket): interfaces.IMessage {
      try {
          const client = this.clients[socket.id];

          if (!client.ownerOf.length) {
              return { type: "error", msg: messageEnum.notAuthor };
          }

          if (!this.rooms[client.ownerOf]) {
              return { type: "error", msg: messageEnum.roomNotFound };
          }

          const clientSocket: Socket = this.server.sockets.sockets.get(
              this.rooms[client.ownerOf]?.clientId
          );

          if (clientSocket) {
              this.clients[clientSocket.id].joinTo = "";
              clientSocket.emit("leaveRoomSuccess");
              clientSocket.send({
                  type: "success",
                  msg: messageEnum.leaveRoomSuccess,
              });
          }

          delete this.rooms[client.ownerOf];
          this.clients[socket.id].ownerOf = "";

          socket.emit("removeRoomSuccess");
          return { type: "success", msg: messageEnum.roomRemovedSuccess };
      } catch (err) {
          console.log(err);
          return { type: "error", msg: messageEnum.somethingWentWrong };
      }
  }

  public joinRoom(socket: Socket, joinDto: JoinDto): interfaces.IMessage {
      try {
          const client: interfaces.IClient = this.clients[socket.id];

          if (this.rooms[client.ownerOf]) {
              socket.emit("joinRoomError");
              return { type: "error", msg: messageEnum.alreadyAuthor };
          }

          if (client.joinTo.length) {
              socket.emit("joinRoomError");
              return { type: "error", msg: messageEnum.alreadyJoin };
          }

          if (!this.rooms[joinDto.roomCode]) {
              socket.emit("joinRoomError");
              return { type: "error", msg: messageEnum.roomNotFound };
          }

          this.rooms[joinDto.roomCode].clientId = socket.id;
          this.clients[socket.id].joinTo = joinDto.roomCode;

          if (!this.rooms[joinDto.roomCode]?.ownerId) {
              socket.emit("joinRoomError");
              return { type: "error", msg: messageEnum.roomNotFound };
          }

          const ownerSocket: Socket = this.server.sockets.sockets.get(
              this.rooms[joinDto.roomCode].ownerId
          );

          if (ownerSocket) {
              ownerSocket.emit("joinRoomSuccess", { roomCode: joinDto.roomCode });
              ownerSocket.send({ type: "success", msg: messageEnum.joinRoomSuccess });
          }

          socket.emit("joinRoomSuccess", { roomCode: joinDto.roomCode });
          socket.emit("startWebRtcConnection", { roomCode: joinDto.roomCode });
          return { type: "success", msg: messageEnum.joinRoomSuccess };
      } catch (err) {
          console.log(err);
          return { type: "error", msg: messageEnum.somethingWentWrong };
      }
  }

  public leaveRoom(socket: Socket): interfaces.IMessage {
      try {
          const client: interfaces.IClient = this.clients[socket.id];

          if (client.ownerOf.length) {
              return { type: "error", msg: messageEnum.alreadyAuthor };
          }

          if (!client.joinTo.length) {
              return { type: "error", msg: messageEnum.notJoined };
          }

          const ownerSocket = this.server.sockets.sockets.get(
              this.rooms[client.joinTo].ownerId
          );

          this.rooms[this.clients[socket.id].joinTo].clientId = "";
          this.clients[socket.id].joinTo = "";
          socket.emit("leaveRoomSuccess");

          if (ownerSocket) {
              ownerSocket.emit("leaveRoomSuccess");
              ownerSocket.send({
                  type: "success",
                  msg: messageEnum.leaveRoomSuccess,
              });
          }

          return { type: "success", msg: messageEnum.leaveRoomSuccess };
      } catch (err) {
          console.log(err);
          return { type: "error", msg: messageEnum.somethingWentWrong };
      }
  }

  private generateRoomCode(): string {
      let roomCode = "";

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

  public rtcData(
      socket: Socket,
      rtcData: RtcDataDto
  ): interfaces.IMessage | null {
      try {
          const client = this.clients[socket.id];

          const clientSocket = client.ownerOf.length
              ? this.server.sockets.sockets.get(this.rooms[client.ownerOf]?.clientId)
              : this.server.sockets.sockets.get(this.rooms[client.joinTo]?.ownerId);

          if (clientSocket) {
              clientSocket.emit(rtcData.type, rtcData);
          }

          return null;
      } catch (err) {
          console.log(err);
          return { type: "error", msg: messageEnum.somethingWentWrong };
      }
  }
}
