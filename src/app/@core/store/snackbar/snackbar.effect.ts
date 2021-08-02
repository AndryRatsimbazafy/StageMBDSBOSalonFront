import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap, delay } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { showSnackbar, closeSnackbar } from './snackbar.action';
import { SnackbarComponent } from 'src/app/@shared/snackbar/snackbar.component';

@Injectable()
export class SnackbarEffects {
  constructor(private actions$: Actions, private matSnackBar: MatSnackBar) { }

  showSnackbar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(showSnackbar),
      map(data => data.config),
      tap((config) =>
        this.matSnackBar.openFromComponent(SnackbarComponent, {
          verticalPosition: config.static.verticalPosition,
          horizontalPosition: config.static.horizontalPosition,
          panelClass: config.static.panelClass,
          data: config.data
        })
      ),
      delay(4000),
      map(() => closeSnackbar())
    )
  );

  closeSnackbars$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(closeSnackbar),
        tap(() => this.matSnackBar.dismiss())
      ),
    { dispatch: false }
  );
}
