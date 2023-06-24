import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { wsNode, WSReducer, WSReducerState } from './ws-store/ws.reducer';
import { webRtcNode, WebRtcReducer, WebRtcReducerState } from './webrtc-store/webrtc.reducer';

export interface State {
    [wsNode]: WSReducerState,
    [webRtcNode]: WebRtcReducerState
}

export const reducers: ActionReducerMap<State> = {
    [wsNode]: WSReducer,
    [webRtcNode]: WebRtcReducer
};


export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
