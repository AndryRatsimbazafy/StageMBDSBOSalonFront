import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AccountState } from '../../schema/account.schema';

export const getRouteState = createFeatureSelector<AccountState>('account');

export const selectAccountState = createSelector(
    getRouteState,
    (state) => state
);

export const selectAccountLoading = createSelector(
    selectAccountState,
    (state) => state?.loading
);

export const selectAccountErrorMessage = createSelector(
    selectAccountState,
    (state) => state?.errorMessage
);

export const selectAccount = createSelector(
    selectAccountState,
    (state) => state?.account
);

export const selectAccountId = createSelector(
    selectAccountState,
    (state) => state?.selectedAccountId
);
