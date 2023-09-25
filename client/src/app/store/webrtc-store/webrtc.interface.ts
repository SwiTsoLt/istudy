export enum webRtcActionsEnum {
    initWebRtcPeerConnection = "[WebRtc] init peer connection",
    createDataChannel = "[WebRtc] Create data channel",
    createOffer = "[WebRtc] Create offer",
    createAnswer = "[WebRtc] Create answer",
    setLocalDescription = "[WebRtc] Set local description",
    setRemoteDescription = "[WebRtc] Set remote description",
    addIceCandidate = "[WebRtc] Add ice candidate",
    sendOffer = "[WebRtc] Send offer",
    connectSuccess = "[WebRtc] Connect success",
    disconnectSuccess = "[WebRtc] Disconnect success",
    sendMessage = "[WebRtc] Send message",
    empty = "[WebRtc] Empty",
}

export enum webRtcDataTypeEnum {
    offer = "offer",
    answer = "answer",
    icecandidate = "icecandidate"
}

export enum DataChannelLabelEnum {
    dataChannel = "dataChannel",
    positionChannel = "positionChannel"
}

export enum DataChannelDataTypeEnum {
    openMap = "openMap",
    exitMap = "exitMap"
}

export enum DataChannelPositionTypeEnum {
    setCameraPosition = "setCameraPosition"
}

export interface IListenerReturnData {
    roomCode?: string,
    candidate?: RTCIceCandidate,
    description?: RTCSessionDescription,
}

export type DataChannelMessageType = DataChannelDataTypeEnum | DataChannelPositionTypeEnum
export type DataChannelMessageDataType = unknown