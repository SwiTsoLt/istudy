import { createReducer, on } from '@ngrx/store';
import * as WSActions from './ws.actions';

export const wsNode = "websocket"

export interface WSReducerState {
    roomCode: string,
    messageLabel: string,
    showOwnerPopupState: boolean,
    showJoinerPopupState: boolean,
    inviteQrCodeUrl: string,
    isOwner: boolean,
}

export const initialState: WSReducerState = {
    roomCode: '-',
    messageLabel: '-',
    showOwnerPopupState: false,
    showJoinerPopupState: false,
    inviteQrCodeUrl: '',
    isOwner: false,
}

export const WSReducer = createReducer(
    initialState,
    on(WSActions.createRoom, state => state),
    on(WSActions.createRoomSuccess, (state, { roomCode }) => ({
        ...state,
        roomCode,
        inviteQrCodeUrl: `${window.location.href}?roomCode=${roomCode}`,
        showOwnerPopupState: true,
        isOwner: true
    })),
    on(WSActions.createRoomError, state => state),

    on(WSActions.removeRoom, state => state),
    on(WSActions.removeRoomSuccess, state => ({ ...state, roomCode: '-', inviteQrCodeUrl: '', showOwnerPopupState: false, isOwner: false })),
    on(WSActions.removeRoomError, state => state),

    on(WSActions.joinRoom, state => state),
    on(WSActions.joinRoomSuccess, (state, { roomCode }) => ({ ...state, roomCode })),
    on(WSActions.joinRoomError, state => state),

    on(WSActions.leaveRoom, state => state),
    on(WSActions.leaveRoomSuccess, state => ({ ...state, roomCode: state.isOwner ? state.roomCode : '-', showOwnerPopupState: false, showJoinerPopupState: false })),
    on(WSActions.leaveRoomError, state => state),

    on(WSActions.openJoinerPopup, state => ({ ...state, showJoinerPopupState: true })),
    on(WSActions.openOwnerPopup, state => ({ ...state, showOwnerPopupState: true })),
    on(WSActions.closeJoinerPopup, state => ({ ...state, showJoinerPopupState: false })),
    on(WSActions.newMessage, (state, { msg }) => ({ ...state, messageLabel: msg })),
)