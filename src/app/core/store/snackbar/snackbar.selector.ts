import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { SnackbarState } from 'src/app/core/schema/snackbar.schema';

export const getRouteState = createFeatureSelector<SnackbarState>('snackbar');

export const selectSnackbarState = createSelector(
  getRouteState,
  (state) => state
);

export const selectSnackbarShow = createSelector(
  selectSnackbarState,
  // tslint:disable-next-line: variable-name
  (state) => state.show
);
