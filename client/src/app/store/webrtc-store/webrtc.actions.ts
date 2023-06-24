import { createAction, props } from '@ngrx/store';
import { webRtcActionsEnum } from './webrtc.interface';

export const initWebRtcPeerConnection = createAction(webRtcActionsEnum.initWebRtcPeerConnection);
export const createDataChannel = createAction(webRtcActionsEnum.createDataChannel, props<{ label: string }>());
export const createOffer = createAction(webRtcActionsEnum.createOffer);
export const createAnswer = createAction(webRtcActionsEnum.createAnswer);
export const setLocalDescription = createAction(webRtcActionsEnum.setLocalDescription, props<{ description: RTCSessionDescriptionInit }>());
export const setRemoteDescription = createAction(webRtcActionsEnum.setRemoteDescription, props<{ description: RTCSessionDescriptionInit }>());
export const addIceCandidate = createAction(webRtcActionsEnum.addIceCandidate, props<{ candidate: RTCIceCandidate }>());
export const connectSuccess = createAction(webRtcActionsEnum.connectSuccess)
export const disconnectSuccess = createAction(webRtcActionsEnum.disconnectSuccess)