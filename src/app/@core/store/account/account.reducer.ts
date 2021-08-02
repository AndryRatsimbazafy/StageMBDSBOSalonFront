import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { AccountEntry, AccountState } from '../../schema/account.schema';
import {
    accountLoginFail,
    accountLoginRequested,
    accountLoginSuccess,
    accountLogoutFail,
    accountLogoutRequested,
    accountLogoutSuccess,
    forgotPasswordFail,
    forgotPasswordRequested,
    forgotPasswordSuccess,
    getUserRequested,
    getUserSuccess,
    resetPasswordFail,
    resetPasswordRequested,
    resetPasswordSuccess
} from './account.action';

export const AccountAdapter: EntityAdapter<AccountEntry> = createEntityAdapter<AccountEntry>({
    selectId: (entry) => entry.email,
});

export const initialState: AccountState = AccountAdapter.getInitialState({
    loading: false,
    errorMessage: undefined,
    account: undefined,
    selectedAccountId: undefined
});

export const AccountReducer = createReducer(
    initialState,
    // Request
    on(
        accountLoginRequested,
        accountLogoutRequested,
        forgotPasswordRequested,
        resetPasswordRequested,
        getUserRequested,
        (state) => {
            return {
                ...state,
                loading: true,
                errorMessage: undefined,
                account: undefined
            };
        }
    ),
    on(forgotPasswordSuccess, resetPasswordSuccess,
        (state) => {
            return {
                ...state,
                loading: false,
                errorMessage: undefined,
            };
        }
    ),
    // Login reducer
    on(
        accountLoginSuccess,
        getUserSuccess,
        (state, { entry }) => {
            return AccountAdapter.addOne(entry, {
                ...state,
                loading: false,
                errorMessage: null,
                account: entry
            });
        }),
    on(
        accountLoginFail,
        accountLogoutFail,
        forgotPasswordFail,
        resetPasswordFail,
        (state, { errorMessage }) => {
            return {
                ...state,
                loading: false,
                errorMessage,
                account: undefined
            };
        }
    ),
    // Logout reducer
    on(accountLogoutSuccess, (state) => {
        return AccountAdapter.removeAll({
            ...state,
            loading: false,
            errorMessage: undefined,
            account: undefined
        });
    })
);
