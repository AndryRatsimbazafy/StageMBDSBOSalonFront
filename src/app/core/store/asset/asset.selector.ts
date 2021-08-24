import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AssetState } from '../../schema/asset.schema';
import * as fromAsset from './asset.reducer';

export const getRouteState = createFeatureSelector<AssetState>('assets');

export const selectAssetState = createSelector(
    getRouteState,
    (state) => state
);

export const selectAllAssets = createSelector(
    selectAssetState,
    fromAsset.selectAll
);

export const selectListEntries = createSelector(
    selectAssetState,
    ({ listEntries }) => listEntries
);

export const selectAsset = createSelector(
    selectAssetState,
    (state) => state?.asset
);

export const selectAssetLoading = createSelector(
    selectAssetState,
    ({ loading }) => loading
);

export const selectAssetUpload = createSelector(
    selectAssetState,
    ({ uploading }) => uploading
);

export const selectAssetError = createSelector(
    selectAssetState,
    ({ errorMessage }) => errorMessage
);

export const selectAssetUploadedBytes = createSelector(
    selectAssetState,
    ({ uploadedBytes }) => uploadedBytes
);