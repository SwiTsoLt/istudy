import { createAction, props } from "@ngrx/store";
import { wsActionsEnum, wsErrorActionsEnum, wsSuccessActionsEnum } from "./ws.interface"

export const createRoom = createAction(wsActionsEnum.createRoom);
export const createRoomSuccess = createAction(wsSuccessActionsEnum.createRoomSuccess, props<{ roomCode: string }>());
export const createRoomError = createAction(wsErrorActionsEnum.createRoomError)

export const removeRoom = createAction(wsActionsEnum.removeRoom)
export const removeRoomSuccess = createAction(wsSuccessActionsEnum.removeRoomSuccess)
export const removeRoomError = createAction(wsErrorActionsEnum.removeRoomError)

export const joinRoom = createAction(wsActionsEnum.joinRoom, props<{ roomCode: string }>())
export const joinRoomSuccess = createAction(wsSuccessActionsEnum.joinRoomSuccess, props<{ roomCode: string }>())
export const joinRoomError = createAction(wsErrorActionsEnum.joinRoomError)

export const leaveRoom = createAction(wsActionsEnum.leaveRoom)
export const leaveRoomSuccess = createAction(wsSuccessActionsEnum.leaveRoomSuccess)
export const leaveRoomError = createAction(wsErrorActionsEnum.leaveRoomError)

export const openJoinerPopup = createAction(wsActionsEnum.openJoinerPopup)
export const openOwnerPopup = createAction(wsActionsEnum.openOwnerPopup)
export const closeJoinerPopup = createAction(wsActionsEnum.closeJoinerPopup)
export const newMessage = createAction(wsActionsEnum.newMessage, props<{ msg: string }>())
