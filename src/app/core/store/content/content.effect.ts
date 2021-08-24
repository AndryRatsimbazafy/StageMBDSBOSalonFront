import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map } from 'rxjs/operators';
import { ContentAPIService } from '../../service/content.api.service';
import * as contentActions from './content.action';
import { SnackbarService } from '../../service/snackbar.service';

@Injectable()
export class ContentEffects {
  addRequested$ = createEffect(() =>
    this.actions$.pipe(
      ofType(contentActions.addContentRequested),
      switchMap(({ input }) =>
        this.contentAPI.createContent(input).pipe(
          map((response) => {
            return contentActions.addContentSuccess({ entry: response.body });
          }),
          catchError((error) =>
            of(contentActions.addContentFail({ errorMessage: error }))
          )
        )
      )
    )
  );

  getRequested$ = createEffect(() =>
    this.actions$.pipe(
      ofType(contentActions.getContentRequested),
      switchMap(() =>
        this.contentAPI.getContent().pipe(
          map((response) => {
            return contentActions.getContentSuccess({
              entry: response.body[0],
            });
          }),
          catchError((error) => {
            console.log(error);
            return of(contentActions.getContentFail({ errorMessage: error }));
          })
        )
      )
    )
  );

  updateRequested$ = createEffect(() =>
    this.actions$.pipe(
      ofType(contentActions.updateContentRequested),
      switchMap(({ param, body }) =>
        this.contentAPI.updateContent(param, body).pipe(
          map((response) => {
            this.snack.openSnackBarAlert(
              'success',
              'Contenu mis à jour avec succes'
            );
            return contentActions.updateContentSuccess({
              entry: response.body,
            });
          }),
          catchError((error) => {
            this.snack.openSnackBarAlert(
              'error',
              'Une erreur s\'est produite pendant la mise à jour'
            );
            return of(
              contentActions.updateContentFail({ errorMessage: error })
            );
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private contentAPI: ContentAPIService,
    private snack: SnackbarService
  ) { }
}
