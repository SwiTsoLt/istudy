import { createReducer, on } from "@ngrx/store"
import * as CanvasActions from './canvas.actions'
import { IPosition } from "../../components/pages/controller/controller.service"

export const canvasNode = 'canvas'

export interface CanvasState {
    cameraPosition: IPosition
}

export const initialState: CanvasState = {
    cameraPosition: {beta: 0, gamma: 0}
}

export const CanvasReducer = createReducer(
    initialState,
    on(CanvasActions.setCameraPosition, (state, { pos }) => ({ ...state, cameraPosition: pos })),
)