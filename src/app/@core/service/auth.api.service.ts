import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AccountLogin, AccountLogout, AccountState } from '../schema/account.schema';
import { MainService } from './main.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthAPIService {
  constructor(public jwtHelper: JwtHelperService, public service: MainService) {
  }

  login(body: AccountLogin): Observable<any> {
    return this.service._POST('/api/auth/login', body);
  }

  logout(body: AccountLogout): Observable<any> {
    return this.service._POST('/api/auth/logout', { _id: body });
  }

  refreshToken() {
    return this.service._POST('/api/auth/refreshtoken', {
      refreshToken: this.getRefreshToken()
    }).pipe(
      tap(response => {
        this.storeTokens(response.accessToken, response.refreshToken);
      })
    );
  }

  isAuthenticated(): boolean {
    const token = this.getRefreshToken();
    // Check whether the refresh token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }

  getAccessToken() {
    return localStorage.getItem('access-token');
  }

  getRefreshToken() {
    return localStorage.getItem('refresh-token');
  }

  storeTokens(access: string, refresh?: string) {
    localStorage.setItem('access-token', access);
    if (refresh) {
      localStorage.setItem('refresh-token', refresh);
    }
  }

  clearTokens() {
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
  }

  forgotPassword(body: any): Observable<any> {
    return this.service._POST('/api/auth/forgotpassword', body);
  }

  resetPassword(resetToken: any, body: any): Observable<any> {
    return this.service._PUT('/api/auth/resetpassword', resetToken, body);
  }

  getNewAccessToken(): Observable<any> {
    return this.service._POST('/api/auth/newAccessToken', {});
  }
}
