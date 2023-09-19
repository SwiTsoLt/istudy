import { createFeatureSelector, createSelector } from "@ngrx/store";
import { WebRtcReducerState, webRtcNode } from "./webrtc.reducer";

export const selectFeature = createFeatureSelector<WebRtcReducerState>(webRtcNode);

export const selectRTCPeerConnection = createSelector(
    selectFeature,
    (state: WebRtcReducerState): RTCPeerConnection | null => state.pc
);

export const selectIsConnected = createSelector(
    selectFeature,
    (state: WebRtcReducerState): boolean => state.isConnected
);