import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map } from 'rxjs/operators';
import { RoomAPIService } from '../../service/room.api.service';
import * as roomActions from './room.action';
import { SnackbarService } from '../../service/snackbar.service';

@Injectable()
export class RoomEffects {
  addRequested$ = createEffect(() =>
    this.actions$.pipe(
      ofType(roomActions.addRoomRequested),
      switchMap(({ input }) =>
        this.roomAPI.add(input).pipe(
          map((response) => {
            this.snackbar.openSnackBarAlert('success', 'Stand créé avec succès');
            return roomActions.addRoomSuccess({ entry: response.body });
          }),
          catchError((error) => {
            this.snackbar.openSnackBarAlert('error', error.error.error ? error.error.error : 'erreur du serveur');
            return of(roomActions.addRoomFail({ errorMessage: error }));
          }
          )
        )
      )
    )
  );

  getRequested$ = createEffect(() =>
    this.actions$.pipe(
      ofType(roomActions.getAllRoomsRequested),
      switchMap(() =>
        this.roomAPI.getAll().pipe(
          map((response) => {
            return roomActions.getAllRoomsSuccess({
              entries: response.body,
            });
          }),
          catchError((error) => {
            console.log(error);
            return of(roomActions.getAllRoomsFail({ errorMessage: error }));
          })
        )
      )
    )
  );

  getByUserRequested$ = createEffect(() =>
    this.actions$.pipe(
      ofType(roomActions.getRoomByUserRequested),
      switchMap(({ input }) =>
        this.roomAPI.getByUser(input).pipe(
          map((response) => {
            return roomActions.getRoomByUserSuccess({
              entry: response.body,
            });
          }),
          catchError((error) => {
            console.log(error);
            return of(roomActions.getRoomByUserFail({ errorMessage: error }));
          })
        )
      )
    )
  );

  updateRequested$ = createEffect(() =>
    this.actions$.pipe(
      ofType(roomActions.updateRoomRequested),
      switchMap(({ param, body }) =>
        this.roomAPI.update(param, body).pipe(
          map((response) => {
            this.snackbar.openSnackBarAlert(
              'success',
              'Contenu mis à jour avec succes'
            );
            return roomActions.updateRoomSuccess({
              entry: response.body,
            });
          }),
          catchError((error) => {
            this.snackbar.openSnackBarAlert(
              'error',
              'Une erreur s\'est produite pendant la mise à jour'
            );
            return of(
              roomActions.updateRoomFail({ errorMessage: error })
            );
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private roomAPI: RoomAPIService,
    private snackbar: SnackbarService
  ) { }
}
