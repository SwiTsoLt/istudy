import { createFeatureSelector, createSelector } from "@ngrx/store";
import { WSReducerState, wsNode } from "./ws.reducer";


export const selectFeature = createFeatureSelector<WSReducerState>(wsNode);

export const selectMessageLabel = createSelector(
    selectFeature,
    (state: WSReducerState): string => state.messageLabel
);

export const selectRoomCode = createSelector(
    selectFeature,
    (state: WSReducerState): string => state.roomCode
);

export const selectShowOwnerPopupState = createSelector(
    selectFeature,
    (state: WSReducerState): boolean => state.showOwnerPopupState
);

export const selectShowJoinerPopupState = createSelector(
    selectFeature,
    (state: WSReducerState): boolean => state.showJoinerPopupState
);

export const selectInviteQrCodeUrl = createSelector(
    selectFeature,
    (state: WSReducerState): string => state.inviteQrCodeUrl
);

export const selectIsOwner = createSelector(
    selectFeature,
    (state: WSReducerState): boolean => state.isOwner
);

export const selectIsReady = createSelector(
    selectFeature,
    (state: WSReducerState): boolean => state.isReady
);