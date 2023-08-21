import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CanvasState, canvasNode } from "./canvas.reducer";
import { IPosition } from "../../components/controller/controller.service";

export const selectFeature = createFeatureSelector<CanvasState>(canvasNode)

export const selectCameraPosition = createSelector(
    selectFeature,
    (state: CanvasState): IPosition => state.cameraPosition
)