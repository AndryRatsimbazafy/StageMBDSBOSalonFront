import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { AccountEntry, UserState } from '../../schema/account.schema';
import {
    commercialLoaded,
    commercialLoadFailed,
    commercialLoadRequested,
    exposantLoaded,
    exposantLoadFailed,
    exposantLoadRequested,
    exposantNotSetLoaded,
    exposantNotSetLoadFailed,
    exposantNotSetLoadRequested,
    getUserByStandFail,
    getUserByStandRequested,
    getUserByStandSuccess,
    userAddedReset,
    userDeleted,
    userDeleteRequested,
    userLoaded,
    userLoadFailed,
    userLoadRequested, userSaved, userSaveFailed, userSaveRequested, userUpdated, userUpdateFailed, userUpdateRequested
} from './user.action';

export const adapter: EntityAdapter<AccountEntry> = createEntityAdapter<AccountEntry>({
    selectId: (entry) => entry._id,
    sortComparer: sortByCretedDate,
});

export const initialState: UserState = adapter.getInitialState({
    loading: false,
    isSaving: false,
    listEntries: [],
    errorMessage: undefined,
    userAdded: undefined,
});

export const UserReducer = createReducer(
    initialState,
    // select
    on(userLoadRequested, commercialLoadRequested, exposantLoadRequested, exposantNotSetLoadRequested,
        getUserByStandRequested, (state) => ({
            ...state,
            loading: true
        })),
    on(userLoaded, commercialLoaded, exposantLoaded, exposantNotSetLoaded, (state, { entries }) => {
        return adapter.setAll(entries, {
            ...state,
            loading: false,
            errorMessage: undefined,
        });
    }),
    on(getUserByStandSuccess,
        (state, { entry }) => {
            return {
                ...state,
                loading: false,
                user: entry,
            };
        }),
    // save
    on(userSaveRequested, (state) => ({
        ...state,
        isSaving: true
    })),
    on(userSaved, (state, { entry }) => {
        return adapter.addOne(entry, {
            ...state,
            isSaving: false,
            userAdded: entry,
            errorMessage: undefined
        });
    }),
    on(userAddedReset, (state) => ({
        ...state,
        userAdded: undefined
    })),
    // update
    on(userUpdateRequested, (state) => ({
        ...state,
        isSaving: true
    })),
    on(userUpdated, (state, { entry }) => {
        return adapter.updateOne({
            id: entry._id,
            changes: entry
        },
            {
                ...state,
                isSaving: false,
                errorMessage: undefined
            });
    }),
    // delete
    on(userDeleteRequested, (state) => ({
        ...state,
        isSaving: true
    })),
    on(userDeleted, (state, { entry }) => {
        return adapter.removeOne(entry._id, {
            ...state,
            isSaving: false,
            errorMessage: undefined
        });
    }),
    // error
    on(
        userLoadFailed,
        userSaveFailed,
        userUpdateFailed,
        commercialLoadFailed,
        exposantLoadFailed,
        exposantNotSetLoadFailed,
        userUpdateFailed,
        getUserByStandFail,
        (state, { errorMessage }) => {
            return {
                ...state,
                loading: false,
                isSaving: false,
                errorMessage,
                user: undefined,
            };
        }),
);

export function sortByCretedDate(a: AccountEntry, b: AccountEntry): number {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
}

export const {
    selectAll,
} = adapter.getSelectors();
