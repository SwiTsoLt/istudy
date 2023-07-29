import { createReducer, on } from '@ngrx/store';
import * as WebRtcActions from './webrtc.actions';

export const webRtcNode = 'webRtc'

export interface WebRtcReducerState {
    pc: RTCPeerConnection | null,
    isConnected: boolean
}

export const initialState: WebRtcReducerState = {
    pc: null,
    isConnected: false
}

const webRtcOptions = {
    iceServers: [
        {
            username: undefined,
            credential: undefined,
            url: 'stun:stun.voiparound.com',
            urls: ['stun:stun.voiparound.com']
        },
        {
            username: undefined,
            credential: undefined,
            url: 'stun:stun.voxgratia.org',
            urls: ['stun:stun.voxgratia.org']
        }
    ]
}

export const WebRtcReducer = createReducer(
    initialState,
    on(WebRtcActions.initWebRtcPeerConnection, state => ({ ...state, pc: new RTCPeerConnection(webRtcOptions) })),
    on(WebRtcActions.createDataChannel, (state) => state),
    on(WebRtcActions.createOffer, state => state),
    on(WebRtcActions.setLocalDescription, (state, { description }) => {
        state.pc?.setLocalDescription(description)
        return state
    }),
    on(WebRtcActions.setRemoteDescription, (state, { description }) => {
        state.pc?.setRemoteDescription(description)
        return state
    }),
    on(WebRtcActions.addIceCandidate, (state, { candidate }) => {
        state.pc?.addIceCandidate(candidate)
        return state
    }),
    on(WebRtcActions.sendMessage, state => state),
    on(WebRtcActions.connectSuccess, state => ({ ...state, isConnected: true })),
    on(WebRtcActions.disconnectSuccess, () => ({ pc: null, isConnected: false })),
)