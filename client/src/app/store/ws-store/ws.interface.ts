export enum wsActionsEnum {
    createRoom = '[WS] Create room',
    removeRoom = '[WS] Remove room',
    joinRoom = '[WS] Join room',
    leaveRoom = '[WS] Leave Room',
    openJoinerPopup = '[WS] Open joiner popup',
    openOwnerPopup = '[WS] Open owner popup',
    closeJoinerPopup = '[WS] Close joiner popup',
    newMessage = '[WS] New message',
}

export enum wsSuccessActionsEnum {
    createRoomSuccess = '[WS] Create room success',
    removeRoomSuccess = '[WS] Remove room success',
    joinRoomSuccess = '[WS] Join room success',
    leaveRoomSuccess = '[WS] Leave room success',
}

export enum wsErrorActionsEnum {
    createRoomError = '[WS] Create room error',
    removeRoomError = '[WS] Remove room error',
    joinRoomError = '[WS] Join room error',
    leaveRoomError = '[WS] Leave room error',
}

export enum wsEventsEnum {
    createRoom = 'createRoom',
    removeRoom = 'removeRoom',
    joinRoom = 'joinRoom',
    leaveRoom = 'leaveRoom',
    rtcData = 'rtcData',
    message = 'message',
}

export enum wsListenerEventEnum {
    createRoomSuccess = 'createRoomSuccess',
    createRoomError = 'createRoomError',
    removeRoomSuccess = 'removeRoomSuccess',
    removeRoomError = 'removeRoomError',
    joinRoomSuccess = 'joinRoomSuccess',
    joinRoomError = 'joinRoomError',
    leaveRoomSuccess = 'leaveRoomSuccess',
    leaveRoomError = 'leaveRoomError',
    startWebRtcConnection = 'startWebRtcConnection',
    
    offer = 'offer',
    answer = 'answer',
    icecandidate = 'icecandidate',
}