import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AccountEntry, UserState } from '../../schema/account.schema';
import * as fromUser from './user.reducer';

export const getRouteState = createFeatureSelector<UserState>('users');

export const selectUserState = createSelector(
    getRouteState,
    (state) => state
);

export const selectAllUsers = createSelector(
    selectUserState,
    fromUser.selectAll
);

export const selectListEntries = createSelector(
    selectUserState,
    ({ listEntries }) => listEntries
);

export const selectUserLoading = createSelector(
    selectUserState,
    ({ loading }) => loading
);

export const selectUserSaving = createSelector(
    selectUserState,
    ({ isSaving }) => isSaving
);

export const selectUserSaved = createSelector(
    selectUserState,
    ({ userAdded }) => userAdded
);

export const selectUserByStand = createSelector(
    selectUserState,
    ({ user }) => user
);

export const selectUserErrorMessage = createSelector(
    selectUserState,
    ({ errorMessage }) => errorMessage
);
