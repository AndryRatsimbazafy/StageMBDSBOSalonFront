import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as AccountAction from './account.action';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { UserManagementAPIService } from '../../service/user-management.api.service';
import { AuthAPIService } from '../../service/auth.api.service';
import { SnackbarService } from '../../service/snackbar.service';

@Injectable()
export class AccountEffects {

    constructor(
        private actions$: Actions,
        private authAPI: AuthAPIService,
        private userAPI: UserManagementAPIService,
        private router: Router,
        protected store: Store,
        private snackbar: SnackbarService
    ) {
    }

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountAction.accountLoginRequested),
            switchMap(({ input }) =>
                this.authAPI.login(input).pipe(
                    mergeMap((response) => {
                        // tslint:disable-next-line: curly
                        if (!response.body) throw new Error(response.message);
                        this.authAPI.storeTokens(response.accessToken, response.refreshToken);
                        if (response.body.role !== 'commercial') {
                            this.router.navigate(['/']);
                        } else {
                            this.router.navigate(['/chat']);
                        }
                        return [
                            AccountAction.accountLoginSuccess({ entry: response.body })
                        ];
                    }),
                    catchError((error) => {
                        console.log('Error', error);
                        return of(AccountAction.accountLoginFail({ errorMessage: error }));
                    })
                )
            )
        )
    );

    forgot$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountAction.forgotPasswordRequested),
            switchMap(({ input }) =>
                this.authAPI.forgotPassword(input).pipe(
                    map((response) => {
                        if (!response.success) {
                            throw new Error(response.message);
                        }
                        this.snackbar.openSnackBarAlert('success', 'email envoyé');
                        return AccountAction.forgotPasswordSuccess();
                    }),
                    catchError((error) => {
                        console.log('error', error);
                        return of(AccountAction.forgotPasswordFail({ errorMessage: error }));
                    })
                )
            )
        )
    );

    reset$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountAction.resetPasswordRequested),
            switchMap(({ param, body }) =>
                this.authAPI.resetPassword(param, body).pipe(
                    map((response) => {
                        if (!response.success) {
                            throw new Error(response.message);
                        }
                        this.snackbar.openSnackBarAlert('success', 'Mot de passe réinitialisé avec success');
                        return AccountAction.resetPasswordSuccess();
                    }),
                    catchError((error) => {
                        console.log('error', error);
                        return of(AccountAction.forgotPasswordFail({ errorMessage: error.error.error ? error.error.error : 'erreur du serveur' }));
                    })
                )
            )
        )
    );

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountAction.accountLogoutRequested),
            switchMap(({ input }) =>
                this.authAPI.logout(input).pipe(
                    map(() => {
                        this.authAPI.clearTokens();
                        this.router.navigate(['/login']);
                        return AccountAction.accountLogoutSuccess();
                    }),
                    catchError((error) => {
                        console.log('Error', error);
                        return of(AccountAction.accountLogoutFail({ errorMessage: error }));
                    }
                    )
                )
            )
        )
    );

    getUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountAction.getUserRequested),
            switchMap(({ input }) =>
                this.userAPI.get(input._id).pipe(
                    map((response) => {
                        if (!response.body) {
                            throw new Error(response.message);
                        }
                        return AccountAction.getUserSuccess({ entry: response.body });
                    }),
                    catchError((error) => {
                        localStorage.removeItem('access-token');
                        this.router.navigate(['/login']);
                        return of(AccountAction.getUserFail({ errorMessage: error }));
                    })
                )
            )
        )
    );

    newAccessToken$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountAction.getNewAccessTokenRequested),
            switchMap(() =>
                this.authAPI.getNewAccessToken().pipe(
                    mergeMap((response) => {
                        this.authAPI.storeTokens(response.accessToken);
                        return [
                            AccountAction.getNewAccessTokenSuccess()
                        ];
                    }),
                    catchError((error) => {
                        console.log('Error', error);
                        return of(AccountAction.getNewAccessTokenFail({ errorMessage: error }));
                    })
                )
            )
        )
    );
}
