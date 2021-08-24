import { createAction, props } from '@ngrx/store';
import { AssetEntry } from '../../schema/asset.schema';

const source = 'assets';

// List Users
export const assetLoadRequested = createAction(`[${source}] load requested`);
export const assetLoaded = createAction(
  `[${source}] loaded`,
  props<{ entries: AssetEntry[] }>()
);
export const assetLoadFailed = createAction(
  `[${source}] load failure`,
  props<{ errorMessage: string }>()
);


// Add asset
export const assetSaveRequested = createAction(
  `[${source}] save requested`,
  props<{ input: any }>()
);

export const assetSaving = createAction(
  `[${source}] saving`,
  props<{ uploadedBytes: number }>()
);

export const assetSaved = createAction(
  `[${source}] saved`,
  props<{ entry: AssetEntry }>()
);

export const assetSaveFailed = createAction(
  `[${source}] save failure`,
  props<{ errorMessage: string }>()
);

// Delete asset
export const assetDeleteRequested = createAction(
  `[${source}] delete requested`,
  props<{ id: string }>()
);

export const assetDeleted = createAction(
  `[${source}] deleted`,
  props<{ entry: AssetEntry }>()
);

export const assetDeleteFailed = createAction(
  `[${source}] delete failure`,
  props<{ errorMessage: string }>()
);

// Update asset Item
export const assetUpdateItemRequested = createAction(
  `[${source}] update item requested`,
  props<{ param: string, body: any }>()
);

export const assetUpdatedItem = createAction(
  `[${source}] updated item`,
  props<{ entry: AssetEntry }>()
);

export const assetUpdateItemFailed = createAction(
  `[${source}] update item failure`,
  props<{ errorMessage: string }>()
);

export const assetUpdateRequested = createAction(
  `[${source}] update requested`,
  props<{ param: string, body: any }>()
);

export const assetUpdated = createAction(
  `[${source}] updated`,
  props<{ entry: AssetEntry }>()
);

export const assetUpdateFailed = createAction(
  `[${source}] update failure`,
  props<{ errorMessage: string }>()
);

// Get Asset
export const getAssetRequested = createAction(
  `[${source}] get asset requested`,
  props<{ input: { _id: string } }>()
);
export const getAssetSuccess = createAction(
  `[${source}] get asset success`,
  props<{ entry: AssetEntry }>()
);
export const getAssetFail = createAction(
  `[${source}] get asset fail`,
  props<{ errorMessage: any }>()
);

// Get Asset By Exhibitor
export const getAssetByExhibitorRequested = createAction(
  `[${source}] get asset by exhibitor requested`,
  props<{ input: { _id: string } }>()
);
export const getAssetByExhibitorSuccess = createAction(
  `[${source}] get asset by exhibitor success`,
  props<{ entry: AssetEntry }>()
);
export const getAssetByExhibitorFail = createAction(
  `[${source}] get asset by exhibitor fail`,
  props<{ errorMessage: any }>()
);

// Upload File
export const uploadRequested = createAction(
  `[${source}] upload requested`,
  props<{ input: any }>()
);

export const uploadProcessing = createAction(
  `[${source}] upload processing`,
  props<{ uploadedBytes: number }>()
);

export const uploadFinished = createAction(
  `[${source}] upload Finished`
);

export const uploadFailed = createAction(
  `[${source}] upload failure`,
  props<{ errorMessage: string }>()
);