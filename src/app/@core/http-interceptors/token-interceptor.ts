import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, empty, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthAPIService } from '../service/auth.api.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private auth: AuthAPIService) {}

  // tslint:disable-next-line: typedef
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken = this.auth.getAccessToken();

    const authReq = this.addTokenToRequest(req, authToken);

    // not intercept login
    if(req.url.includes("/api/auth/login")) {
      return next.handle(req);
    }

    // send cloned request with header to the next handler.
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('http error...', error);
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  /**
   * Clone the request and replace the original headers with
   * cloned headers, updated with the authorization.
   * */
  private addTokenToRequest(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * First, we check if refreshing has not already started and set isRefreshing variable to true and populate
   * null into refreshTokenSubject behavior subject.
   * Later, the actual refreshing request starts. In case of success, isRefreshing is set to false and received JWT token
   * is placed into the refreshTokenSubject.
   * Finally, we call next.handle with the addTokenToRequest method to tell interceptor that we are done with processing this request.
   * In case the refreshing is already happening (the else part of the if statement), we want to wait until refreshTokenSubject
   * contains value other than null. Using filter(token => token != null) will make this trick! Once there is some value other than null
   * (we expect new JWT inside) we call take(1) to complete the stream.
   * Finally, we can tell the interceptor to finish processing this request with next.handle.
   */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.auth.refreshToken().pipe(
        switchMap((result: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(result.accessToken);
          return next.handle(
            this.addTokenToRequest(request, result.accessToken)
          );
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((accessToken) => {
          return next.handle(this.addTokenToRequest(request, accessToken));
        })
      );
    }
  }
}
