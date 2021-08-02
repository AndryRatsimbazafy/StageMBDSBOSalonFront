import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { AssetEntry, AssetState } from '../../schema/asset.schema';
import {
    assetLoadRequested, assetLoaded, assetSaveRequested, assetSaved,
    assetUpdateRequested, assetUpdated, assetDeleteRequested, assetDeleted,
    assetLoadFailed, assetSaveFailed, assetUpdateFailed, getAssetRequested,
    getAssetFail, getAssetSuccess, getAssetByExhibitorRequested, getAssetByExhibitorSuccess, getAssetByExhibitorFail,
    assetSaving, uploadRequested, uploadFinished, uploadProcessing, uploadFailed, 
    assetUpdateItemRequested,
    assetUpdatedItem,
    assetUpdateItemFailed
} from './asset.action';

export const adapter: EntityAdapter<AssetEntry> = createEntityAdapter<AssetEntry>({
    selectId: (entry) => entry._id,
});

export const initialState: AssetState = adapter.getInitialState({
    loading: false,
    listEntries: [],
    errorMessage: undefined,
    asset: undefined,
    uploading: false,
    uploadedBytes: 0,
});

export const AssetReducer = createReducer(
    initialState,
    // select
    on(assetLoadRequested, getAssetRequested, getAssetByExhibitorRequested,
        (state) => ({
            ...state,
            loading: true,
            errorMessage: undefined,
        })),
    on(assetLoaded,
        (state, { entries }) => {
            return adapter.setAll(entries, {
                ...state,
                loading: false
            });
        }),
    on(getAssetSuccess, getAssetByExhibitorSuccess,
        (state, { entry }) => {
            return adapter.addOne(entry, {
                ...state,
                loading: false,
                errorMessage: null,
                asset: entry,
            });
        }),
    // save
    on(assetSaveRequested, uploadRequested, 
        (state) => ({
            ...state,
            uploading: true,
            errorMessage: undefined,
            uploadedBytes: 0
        })),
    on(assetSaved,
        (state, { entry }) => {
            return adapter.addOne(entry, {
                ...state,
                uploading: false,
                asset: entry,
                uploadedBytes: 0
            });
        }),
    on(uploadFinished,
        (state) => {
            return {
                ...state,
                uploading: false,
                uploadedBytes: 0
            }
        }),
    on(assetSaving, uploadProcessing,
        (state, { uploadedBytes }) => {
            return {
                ...state,
                uploadedBytes
            };
        }),
    // update
    on(assetUpdateRequested, assetUpdateItemRequested,
        (state) => ({
            ...state,
            uploading: true,
            errorMessage: undefined,
            uploadedBytes: 0
        })),
    on(assetUpdated, assetUpdatedItem,
        (state, { entry }) => {
            return {
                ...state,
                uploading: false,
                asset: entry,
                uploadedBytes: 0
            };
        }),
    // delete
    on(assetDeleteRequested,
        (state) => ({
            ...state,
            uploading: true,
            errorMessage: undefined,
        })),
    on(assetDeleted,
        (state, { entry }) => {
            return adapter.removeOne(entry._id, {
                ...state,
                uploading: false
            });
        }),
    // error
    on(
        assetLoadFailed,
        assetSaveFailed,
        assetUpdateFailed,
        assetUpdateItemFailed,
        getAssetFail,
        getAssetByExhibitorFail,
        uploadFailed,
        (state, { errorMessage }) => {
            return {
                ...state,
                loading: false,
                errorMessage,
                asset: undefined,
                uploading: false
            };
        }),
);

export const {
    selectAll,
} = adapter.getSelectors();
