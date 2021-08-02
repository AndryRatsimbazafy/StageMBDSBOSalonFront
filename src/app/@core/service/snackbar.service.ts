import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import {
  snackbarWARN,
  snackbarERROR,
  snackbarSUCCESS
} from 'src/app/@core/schema/snackbar.schema';
import { showSnackbar } from 'src/app/@core/store/snackbar/snackbar.action';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private store: Store<{ snackbar }>) { }

  // tslint:disable-next-line: typedef
  openSnackBarAlert(type: string, message: string) {
    switch (type) {
      case 'success':
        this.store.dispatch(showSnackbar({
          config: {
            static: snackbarSUCCESS,
            data: {
              message,
              icon: 'done'
            }
          }
        }));
        break;

      case 'error':
        this.store.dispatch(showSnackbar({
          config: {
            static: snackbarERROR,
            data: {
              message,
              icon: 'error'
            }
          }
        }));
        break;

      case 'warn':
        this.store.dispatch(showSnackbar({
          config: {
            static: snackbarWARN,
            data: {
              message,
              icon: 'warning'
            }
          }
        }));
        break;
    }
  }
}
