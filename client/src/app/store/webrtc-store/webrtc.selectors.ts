import { createFeatureSelector, createSelector } from "@ngrx/store"
import { WebRtcReducerState, webRtcNode } from "./webrtc.reducer";

export interface AppState {
    selectedRTCPerrConnection: RTCPeerConnection,
}


export const selectFeature = createFeatureSelector<WebRtcReducerState>(webRtcNode)

export const selectRTCPeerConnection = createSelector(
    selectFeature,
    (state: WebRtcReducerState): RTCPeerConnection | null => state.pc
)

export const selectIsReady = createSelector(
    selectFeature,
    (state: WebRtcReducerState): boolean => state.isReady
)