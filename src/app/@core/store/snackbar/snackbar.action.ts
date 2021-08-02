import { createAction, props } from '@ngrx/store';
import { SnackbarConfig } from 'src/app/@core/schema/snackbar.schema';
const source = 'Snackbar';

export const showSnackbar = createAction(
    `[${source}] show snackbar`,
    props<{ config: SnackbarConfig }>()
);

export const closeSnackbar = createAction(
    `[${source}] close snackbar`
);
