export class JoinDto {
  roomCode: string;
}

type RtcDataType = 'description' | 'icecandidate';

export class RtcDataDto {
  type: RtcDataType;
  data: RTCSessionDescriptionInit | RTCIceCandidate;
}
