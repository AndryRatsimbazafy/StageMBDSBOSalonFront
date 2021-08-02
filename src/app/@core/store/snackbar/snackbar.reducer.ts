import { createReducer, on } from '@ngrx/store';
import { showSnackbar, closeSnackbar } from './snackbar.action';
import { SnackbarState } from 'src/app/@core/schema/snackbar.schema';
import * as _ from 'lodash';

export const initialState: SnackbarState = {
  show: false
};

export const snackbarReducer = createReducer(
  initialState,
  on(showSnackbar, state => {
    return {
      ...state,
      show: true
    };
  }),
  on(closeSnackbar, state => {
    return {
      ...state,
      show: false
    };
  })
);

