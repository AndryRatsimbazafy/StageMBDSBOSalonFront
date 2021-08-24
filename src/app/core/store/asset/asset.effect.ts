import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as assetAction from 'src/app/core/store/asset/asset.action';
import { SnackbarService } from '../../service/snackbar.service';
import { UploadAssetsAPIService } from '../../service/upload-assets.api.service';
import { AuthAPIService } from '../../service/auth.api.service';

@Injectable()
export class AssetEffects {

    constructor(
        private actions$: Actions,
        private api: UploadAssetsAPIService,
        private authAPI: AuthAPIService,
        private snackbar: SnackbarService) {
    }

    loadRequested$ = createEffect(() =>
        this.actions$.pipe(
            ofType(assetAction.assetLoadRequested),
            switchMap(() =>
                this.api.getAll().pipe(
                    map((response) => {
                        return assetAction.assetLoaded({ entries: response.body });
                    }),
                    catchError((error) =>
                        of(assetAction.assetLoadFailed({ errorMessage: error }))
                    )
                )
            )
        )
    );

    saveRequested$ = createEffect(() =>
        this.actions$.pipe(
            ofType(assetAction.assetSaveRequested),
            switchMap(({ input }) =>
                this.api.add(input).pipe(
                    map((response) => {
                        if (response.body && response.body.success) {
                            this.snackbar.openSnackBarAlert('success', 'Asset(s) ajouté(s)');
                            return assetAction.assetSaved({ entry: response.body });
                        } else {
                            return assetAction.assetSaving({ uploadedBytes: response.loaded ? response.loaded : 0 });
                        }
                    }),
                    catchError((error) => {
                        console.log('POST upload error', error);
                        this.snackbar.openSnackBarAlert('error', error.error.error ? error.error.error : 'erreur du serveur');
                        return of(assetAction.assetSaveFailed({
                            errorMessage: error.error.error ? error.error.error : 'erreur du serveur'
                        }));
                    })
                )
            )
        )
    );

    deleteRequested$ = createEffect(() =>
        this.actions$.pipe(
            ofType(assetAction.assetDeleteRequested),
            switchMap(({ id }) =>
                this.api.delete(id).pipe(
                    map((response) => {
                        this.snackbar.openSnackBarAlert('success', 'asset supprimé');
                        return assetAction.assetDeleted({ entry: response.body });
                    }),
                    catchError((error) => {
                        this.snackbar.openSnackBarAlert('error', error.error.message ? error.error.message : 'erreur du serveur');
                        return of(assetAction.assetDeleteFailed({ errorMessage: error }));
                    }
                    )
                )
            )
        )
    );

    updateItemRequested$ = createEffect(() =>
        this.actions$.pipe(
            ofType(assetAction.assetUpdateItemRequested),
            switchMap(({ param, body }) =>
                this.api.updateItem(param, body).pipe(
                    map((response) => {
                        this.snackbar.openSnackBarAlert(
                            'success',
                            'Mise à jour effectuée'
                        );
                        return assetAction.assetUpdatedItem({
                            entry: response.body,
                        });
                    }),
                    catchError((error) => {
                        this.snackbar.openSnackBarAlert(
                            'error',
                            'Une erreur s\'est produite pendant la mise à jour'
                        );
                        return of(
                            assetAction.assetUpdateItemFailed({ errorMessage: error })
                        );
                    })
                )
            )
        )
    );

    updateRequested$ = createEffect(() =>
        this.actions$.pipe(
            ofType(assetAction.assetUpdateRequested),
            switchMap(({ param, body }) =>
                this.api.update(param, body).pipe(
                    map((response) => {
                        if (response.body && response.body.success) {
                            this.snackbar.openSnackBarAlert('success', 'Mise à jour effectuée');
                            return assetAction.assetUpdated({ entry: response.body.body ? response.body.body : response.body });
                        } else {
                            return assetAction.assetSaving({ uploadedBytes: response.loaded ? response.loaded : 0 });
                        }
                    }),
                    catchError((error) => {
                        console.log('PUT error', error);
                        this.snackbar.openSnackBarAlert('error', error.error.error ? error.error.error : 'erreur du serveur');
                        return of(assetAction.assetUpdateFailed({
                            errorMessage: error.error.error ? error.error.error : 'erreur du serveur'
                        }));
                    }
                    )
                )
            )
        )
    );

    getAsset$ = createEffect(() =>
        this.actions$.pipe(
            ofType(assetAction.getAssetRequested),
            switchMap(({ input }) =>
                this.api.get(input._id).pipe(
                    map((response) => {
                        if (!response.body) {
                            throw new Error(response.message);
                        }
                        if (response.accessToken) {
                            this.authAPI.storeTokens(response.accessToken);
                        }
                        return assetAction.getAssetSuccess({ entry: response.body });
                    }),
                    catchError((error) => {
                        return of(assetAction.getAssetFail({ errorMessage: error }));
                    })
                )
            )
        )
    );

    getAssetByExhibitor$ = createEffect(() =>
        this.actions$.pipe(
            ofType(assetAction.getAssetByExhibitorRequested),
            switchMap(({ input }) =>
                this.api.getByExhibitor(input._id).pipe(
                    map((response) => {
                        if (!response.body) {
                            throw new Error(response.message);
                        }
                        if (response.accessToken) {
                            this.authAPI.storeTokens(response.accessToken);
                        }
                        return assetAction.getAssetByExhibitorSuccess({ entry: response.body });
                    }),
                    catchError((error) => {
                        return of(assetAction.getAssetByExhibitorFail({ errorMessage: error }));
                    })
                )
            )
        )
    );

    uploadRequested$ = createEffect(() =>
        this.actions$.pipe(
            ofType(assetAction.uploadRequested),
            switchMap(({ input }) =>
                this.api.upload(input).pipe(
                    map((response) => {
                        if (response.body && response.body.success) {
                            return assetAction.uploadFinished();
                        } else {
                            return assetAction.uploadProcessing({ uploadedBytes: response.loaded ? response.loaded : 0 });
                        }
                    }),
                    catchError((error) => {
                        console.log('upload video error', error)
                        this.snackbar.openSnackBarAlert('error', error.error.error ? error.error.error : 'erreur du serveur');
                        return of(assetAction.uploadFailed({ errorMessage: error.error.error ? error.error.error : 'erreur du serveur' }));
                    })
                )
            )
        )
    );

}
