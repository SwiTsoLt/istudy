export class JoinDto {
    roomCode: string;
}

type RtcDataType = "description" | "icecandidate";

export class RtcDataDto {
    type: RtcDataType;
    data: RTCSessionDescriptionInit | RTCIceCandidate;
}

export type messageType = "success" | "error" | "warning" | "notify";

export enum messageEnum {
  leaveRoomSuccess = "Вы успешно покинули комнату",
  joinRoomSuccess = "Вы успешно вошли в комнату",
  alreadyAuthor = "Вы уже являетесь владельцем комнаты",
  alreadyJoin = "Вы уже подключены к комнате",
  createRoomSuccess = "Комната успешно создана",
  notAuthor = "Вы не являетесь владельцем комнаты",
  roomNotFound = "Комната не найдена",
  roomRemovedSuccess = "Комната успешно удалена",
  notJoined = "Вы не присоединены к комнате",
  somethingWentWrong = "Что-то пошло не так",
}
