import { createReducer, on } from "@ngrx/store"
import { ToastType } from "./toast.interface"
import * as ToastActions from './toast.actions'

export const toastNode = 'toast'

export interface IToast {
    type: ToastType,
    text: string
}

export interface ToastState {
    toastList: IToast[]
}

export const initialState: ToastState = {
    toastList: []
}

export const ToastReducer = createReducer(
    initialState,
    on(ToastActions.createToast, (state, { toast }) => ({ toastList: [...state.toastList, toast] })),
    on(ToastActions.removeToast, (state, { toastIndex }) => ({ toastList: state.toastList.filter((_, i) => i !== toastIndex) }))
)