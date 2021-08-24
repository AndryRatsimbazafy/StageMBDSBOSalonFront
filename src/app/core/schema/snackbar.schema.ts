import { MatSnackBarConfig } from '@angular/material/snack-bar';

// constant configs
export const snackbarWARN: MatSnackBarConfig = {
  verticalPosition: 'top',
  horizontalPosition: 'right',
  panelClass: 'snackbar-warn'
};

export const snackbarERROR: MatSnackBarConfig = {
  verticalPosition: 'top',
  horizontalPosition: 'right',
  panelClass: 'snackbar-error'
};

export const snackbarSUCCESS: MatSnackBarConfig = {
  verticalPosition: 'top',
  horizontalPosition: 'right',
  panelClass: 'snackbar-success'
};

// interfaces
export interface SnackbarConfig {
  static: MatSnackBarConfig;
  data: SnackbarData;
}

export interface SnackbarData {
  message: string;
  icon: string;
}

export interface SnackbarState {
  show: boolean;
}
