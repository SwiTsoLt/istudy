import { createReducer, on } from "@ngrx/store";
import * as WebRtcActions from "./webrtc.actions";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const freeice = require("freeice");
export const webRtcNode = "webRtc";

export interface WebRtcReducerState {
    pc: RTCPeerConnection | null,
    isConnected: boolean
}

export const initialState: WebRtcReducerState = {
    pc: null,
    isConnected: false
};

export const WebRtcReducer = createReducer(
    initialState,
    on(WebRtcActions.initWebRtcPeerConnection, state => ({
        ...state, pc: new RTCPeerConnection({ iceServers: freeice() })
    })),
    on(WebRtcActions.createDataChannel, (state) => state),
    on(WebRtcActions.createOffer, state => state),
    on(WebRtcActions.setLocalDescription, (state, { description }) => {
        state.pc?.setLocalDescription(description);
        return state;
    }),
    on(WebRtcActions.setRemoteDescription, (state, { description }) => {
        state.pc?.setRemoteDescription(description);
        return state;
    }),
    on(WebRtcActions.addIceCandidate, (state, { candidate }) => {
        state.pc?.addIceCandidate(candidate);
        return state;
    }),
    on(WebRtcActions.sendMessage, state => state),
    on(WebRtcActions.connectSuccess, state => ({ ...state, isConnected: true })),
    on(WebRtcActions.disconnectSuccess, () => ({ pc: null, isConnected: false })),
);