import { createAction, props } from "@ngrx/store";
import { canvasActionsEnum } from "./canvas.interface";
import { IPosition } from "../../components/pages/controller/controller.service";

export const setCameraPosition = createAction(canvasActionsEnum.setCameraPosition, props<{ pos: IPosition }>());
