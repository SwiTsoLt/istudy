import { createAction, props } from "@ngrx/store";
import { canvasActionsEnum } from "./canvas.interface"
import { IPosition } from "../../components/controller/controller.service";

export const setCameraPosition = createAction(canvasActionsEnum.setCameraPosition, props<{ pos: IPosition }>())
