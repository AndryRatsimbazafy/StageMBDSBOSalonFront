import { createAction, props } from '@ngrx/store';
import { AccountEntry } from '../../schema/account.schema';

const source = 'user';

// List Users
export const userLoadRequested = createAction(`[${source}] load requested`);
export const userLoaded = createAction(
  `[${source}] loaded`,
  props<{ entries: AccountEntry[] }>()
);
export const userLoadFailed = createAction(
  `[${source}] load failure`,
  props<{ errorMessage: string }>()
);

// List Commercial
export const commercialLoadRequested = createAction(`[${source}] commercial load requested`);
export const commercialLoaded = createAction(
  `[${source}] commercial loaded`,
  props<{ entries: AccountEntry[] }>()
);
export const commercialLoadFailed = createAction(
  `[${source}] commercial load failure`,
  props<{ errorMessage: string }>()
);

// Get Exposant
export const exposantLoadRequested = createAction(`[${source}] exposant load requested`);
export const exposantLoaded = createAction(
  `[${source}] exposant loaded`,
  props<{ entries: AccountEntry[] }>()
);
export const exposantLoadFailed = createAction(
  `[${source}] exposant load failure`,
  props<{ errorMessage: string }>()
);

// Get Exposant Not Set
export const exposantNotSetLoadRequested = createAction(`[${source}] exposant not set load requested`);
export const exposantNotSetLoaded = createAction(
  `[${source}] exposant not set loaded`,
  props<{ entries: AccountEntry[] }>()
);
export const exposantNotSetLoadFailed = createAction(
  `[${source}] exposant not set load failure`,
  props<{ errorMessage: string }>()
);

// Add User
export const userSaveRequested = createAction(
  `[${source}] save requested`,
  props<{ input: any }>()
);

export const userSaved = createAction(
  `[${source}] saved`,
  props<{ entry: AccountEntry }>()
);

export const userSaveFailed = createAction(
  `[${source}] save failure`,
  props<{ errorMessage: string }>()
);

// reset added User
export const userAddedReset = createAction(
  `[${source}] saved reset`
);

// Delete User
export const userDeleteRequested = createAction(
  `[${source}] delete requested`,
  props<{ id: string }>()
);

export const userDeleted = createAction(
  `[${source}] deleted`,
  props<{ entry: AccountEntry }>()
);

export const userDeleteFailed = createAction(
  `[${source}] delete failure`,
  props<{ errorMessage: string }>()
);

// Update User
export const userUpdateRequested = createAction(
  `[${source}] update requested`,
  props<{ param: string, body: any }>()
);

export const userUpdated = createAction(
  `[${source}] updated`,
  props<{ entry: AccountEntry }>()
);

export const userUpdateFailed = createAction(
  `[${source}] update failure`,
  props<{ errorMessage: string }>()
);

// Get By Stand
export const getUserByStandRequested = createAction(
  `[${source}] get user by stand requested`,
  props<{ standnumber: number }>()
);
export const getUserByStandSuccess = createAction(
  `[${source}] get user by stand success`,
  props<{ entry: AccountEntry }>()
);
export const getUserByStandFail = createAction(
  `[${source}] get user by stand fail`,
  props<{ errorMessage: any }>()
);
