export interface IRoom {
    id: string;
    name: string;
    clientsIds: string[];
}

export enum RtcDataTypeEnum {
    description = 'description',
    icecandidate = 'icecandidate'
}

export type RtcDataType = RtcDataTypeEnum.description | RtcDataTypeEnum.icecandidate

export interface IRtcData {
    type: RtcDataTypeEnum;
    data: RTCSessionDescriptionInit | RTCIceCandidate | undefined
}

export interface ISocketMessage {
    msg: string
}

export interface IMessage {
    name: string,
    text: string
}

export interface IQueryParams {
    roomCode: string
}