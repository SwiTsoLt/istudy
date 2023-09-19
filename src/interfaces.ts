import { messageType } from "./gateway/gateway.dto";

export interface IRoom {
    ownerId: string;
    clientId: string;
}

export interface IRoomList {
    [key: string]: IRoom;
}

export interface IMessage {
    type: messageType;
    msg: string;
}

export interface IClient {
    ownerOf: string;
    joinTo: string;
}

export interface IClientList {
    [key: string]: IClient;
}
