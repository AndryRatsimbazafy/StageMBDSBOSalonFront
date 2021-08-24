import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserManagementAPIService } from '../../service/user-management.api.service';
import * as userAction from 'src/app/core/store/user/user.action';
import { SnackbarService } from '../../service/snackbar.service';

@Injectable()
export class UserEffects {

    constructor(private actions$: Actions, private api: UserManagementAPIService, private snackbar: SnackbarService) {
    }

    loadRequested$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userAction.userLoadRequested),
            switchMap(() =>
                this.api.getAll().pipe(
                    map((response) => {
                        return userAction.userLoaded({ entries: response.body });
                    }),
                    catchError((error) =>
                        of(userAction.userLoadFailed({ errorMessage: error }))
                    )
                )
            )
        )
    );

    loadCommercialRequested$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userAction.commercialLoadRequested),
            switchMap(() =>
                this.api.getCommercial().pipe(
                    map((response) => {
                        return userAction.commercialLoaded({ entries: response.body });
                    }),
                    catchError((error) =>
                        of(userAction.commercialLoadFailed({ errorMessage: error }))
                    )
                )
            )
        )
    );

    loadExposantRequested$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userAction.exposantLoadRequested),
            switchMap(() =>
                this.api.getExposant().pipe(
                    map((response) => {
                        return userAction.exposantLoaded({ entries: response.body ? response.body : [] });
                    }),
                    catchError((error) =>
                        of(userAction.exposantLoadFailed({ errorMessage: error }))
                    )
                )
            )
        )
    );

    loadExposantNotSetRequested$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userAction.exposantNotSetLoadRequested),
            switchMap(() =>
                this.api.getExposantNotSet().pipe(
                    map((response) => {
                        return userAction.exposantNotSetLoaded({ entries: response.body ? response.body : [] });
                    }),
                    catchError((error) =>
                        of(userAction.exposantNotSetLoadFailed({ errorMessage: error }))
                    )
                )
            )
        )
    );

    saveRequested$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userAction.userSaveRequested),
            switchMap(({ input }) =>
                this.api.add(input).pipe(
                    map((response) => {
                        this.snackbar.openSnackBarAlert('success', 'Utilisateur ajouté avec succès');
                        return userAction.userSaved({ entry: response.body });
                    }),
                    catchError((error) => {
                        this.snackbar.openSnackBarAlert('error', error.error.error ? error.error.error : 'erreur du serveur');
                        return of(userAction.userSaveFailed({ errorMessage: error.error.error ? error.error.error : 'erreur du serveur' }));
                    }
                    )
                )
            )
        )
    );

    deleteRequested$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userAction.userDeleteRequested),
            switchMap(({ id }) =>
                this.api.delete(id).pipe(
                    map((response) => {
                        this.snackbar.openSnackBarAlert('success', 'Utilisateur supprimé');
                        return userAction.userDeleted({ entry: response.body });
                    }),
                    catchError((error) => {
                        this.snackbar.openSnackBarAlert('error', error.error.message ? error.error.message : 'erreur du serveur');
                        return of(userAction.userDeleteFailed({
                            errorMessage: error.error.error ? error.error.error : 'erreur du serveur'
                        }));
                    }
                    )
                )
            )
        )
    );

    updateRequested$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userAction.userUpdateRequested),
            switchMap(({ param, body }) =>
                this.api.update(param, body).pipe(
                    map((response) => {
                        this.snackbar.openSnackBarAlert('success', 'Utilisateur mis à jour');
                        return userAction.userUpdated({ entry: response.body });
                    }),
                    catchError((error) => {
                        this.snackbar.openSnackBarAlert('error', error.error.error ? error.error.error : 'erreur du serveur');
                        return of(userAction.userUpdateFailed({
                            errorMessage: error.error.error ? error.error.error : 'erreur du serveur'
                        }));
                    }
                    )
                )
            )
        )
    );

    getUserByStand$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userAction.getUserByStandRequested),
            switchMap(({ standnumber }) =>
                this.api.getByStand(standnumber).pipe(
                    map((response) => {
                        if (!response.body) {
                            throw new Error(response.message);
                        }
                        return userAction.getUserByStandSuccess({ entry: response.body });
                    }),
                    catchError((error) => {
                        return of(userAction.getUserByStandFail({ errorMessage: error }));
                    })
                )
            )
        )
    );
}
