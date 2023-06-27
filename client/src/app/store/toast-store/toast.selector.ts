import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IToast, ToastState, toastNode } from "./toast.reducer";

export const selectFeature = createFeatureSelector<ToastState>(toastNode)

export const selectToastList = createSelector(
    selectFeature,
    (state: ToastState): IToast[] => state.toastList
)