import { isDevMode } from "@angular/core";
import { ActionReducerMap, MetaReducer } from "@ngrx/store";

import { wsNode, WSReducer, WSReducerState } from "./ws-store/ws.reducer";
import { webRtcNode, WebRtcReducer, WebRtcReducerState } from "./webrtc-store/webrtc.reducer";
import { toastNode, ToastReducer, ToastState } from "./toast-store/toast.reducer";
import { canvasNode, CanvasReducer, CanvasState } from "./canvas-store/canvas.reducer";

export interface State {
    [wsNode]: WSReducerState,
    [webRtcNode]: WebRtcReducerState,
    [toastNode]: ToastState,
    [canvasNode]: CanvasState
}

export const reducers: ActionReducerMap<State> = {
    [wsNode]: WSReducer,
    [webRtcNode]: WebRtcReducer,
    [toastNode]: ToastReducer,
    [canvasNode]: CanvasReducer
};


export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
