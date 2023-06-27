import { createAction, props } from "@ngrx/store";
import { ToastType, toastActionsEnum } from "./toast.interfece";
import { IToast } from "./toast.reducer";

export const createToast = createAction(toastActionsEnum.createToast, props<{ toast: IToast }>())
export const removeToast = createAction(toastActionsEnum.removeToast, props<{ toastIndex: number }>())