import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { wsNode, WSReducer, WSReducerState } from './ws-store/ws.reducer';
import { webRtcNode, WebRtcReducer, WebRtcReducerState } from './webrtc-store/webrtc.reducer';
import { toastNode, ToastReducer, ToastState } from './toast-store/toast.reducer';

export interface State {
    [wsNode]: WSReducerState,
    [webRtcNode]: WebRtcReducerState,
    [toastNode]: ToastState
}

export const reducers: ActionReducerMap<State> = {
    [wsNode]: WSReducer,
    [webRtcNode]: WebRtcReducer,
    [toastNode]: ToastReducer
};


export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
