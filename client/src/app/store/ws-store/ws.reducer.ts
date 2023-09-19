import { createReducer, on } from "@ngrx/store";
import * as WSActions from "./ws.actions";

export const wsNode = "websocket";

export interface WSReducerState {
    roomCode: string,
    messageLabel: string,
    showOwnerPopupState: boolean,
    showJoinerPopupState: boolean,
    inviteQrCodeUrl: string,
    isOwner: boolean,
    isReady: boolean,
}

export const initialState: WSReducerState = {
    roomCode: "-",
    messageLabel: "-",
    showOwnerPopupState: false,
    showJoinerPopupState: false,
    inviteQrCodeUrl: "",
    isOwner: false,
    isReady: true,
};

export const WSReducer = createReducer(
    initialState,
    on(WSActions.createRoom, state => ({ ...state, isReady: false })),
    on(WSActions.createRoomSuccess, (state, { roomCode }) => ({
        ...state,
        roomCode,
        inviteQrCodeUrl: `${window.location.href}?roomCode=${roomCode}`,
        showOwnerPopupState: true,
        isOwner: true,
        isReady: true
    })),
    on(WSActions.createRoomError, state => ({ ...state, isReady: true })),

    on(WSActions.removeRoom, state => ({ ...state, isReady: false })),
    on(WSActions.removeRoomSuccess, state => ({
        ...state,
        roomCode: "-",
        inviteQrCodeUrl: "",
        showOwnerPopupState: false,
        isOwner: false,
        isReady: true
    })),
    on(WSActions.removeRoomError, state => ({ ...state, isReady: true })),

    on(WSActions.joinRoom, state => ({ ...state, isReady: false })),
    on(WSActions.joinRoomSuccess, (state, { roomCode }) => ({ ...state, roomCode, isReady: true })),
    on(WSActions.joinRoomError, state => ({ ...state, isReady: true })),

    on(WSActions.leaveRoom, state => ({ ...state, isReady: false })),
    on(WSActions.leaveRoomSuccess, state => ({
        ...state,
        roomCode: state.isOwner ? state.roomCode : "-",
        showOwnerPopupState: false,
        showJoinerPopupState: false,
        isReady: true
    })),
    on(WSActions.leaveRoomError, state => ({ ...state, isReady: true })),

    on(WSActions.openJoinerPopup, state => ({ ...state, showJoinerPopupState: true })),
    on(WSActions.openOwnerPopup, state => ({ ...state, showOwnerPopupState: true })),
    on(WSActions.closeJoinerPopup, state => ({ ...state, showJoinerPopupState: false })),
    on(WSActions.newMessage, (state, { msg }) => ({ ...state, messageLabel: msg })),
);