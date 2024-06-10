import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, share } from 'rxjs/operators';
import { switchMap } from '@node_modules/rxjs/operators';
import { filter, take } from '@node_modules/rxjs/internal/operators';
import { of } from '@node_modules/rxjs';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { TokenStorageService } from '@app/routes/auth/services/token.service';
import { AccountServiceProxy, AuthJwtDto, Body2, Body3 } from '@service-proxies/danh-muc-service-proxies';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private tokenService: TokenStorageService, private account_SP: AccountServiceProxy) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    let authReq = req;
    const token = this.tokenService.getToken();
    if (token) {
      authReq = this.addTokenHeader(req, token);
    }
    return next.handle(authReq).pipe(
      switchMap((result: HttpResponse<NzSafeAny>) => {
        if (result.url?.includes('user-extension/user-session') && result.status === 204) {
          const access_token = this.tokenService.getToken();
          const refreshToken = this.tokenService.getRefreshToken();
          if (access_token && refreshToken) {
            return this.refreshToken$(authReq, next, access_token, refreshToken);
          }
        }
        return of(result);
      }),
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(authReq, next);
        }
        return throwError(error);
      }),
    );
  }

  private refreshToken$(request: HttpRequest<any>, next: HttpHandler, access_token: string, refreshToken: string) {
    const body = new Body3();
    body.refresh_token = refreshToken;
    body.access_token = access_token;
    return this.account_SP.refreshToken(body).pipe(
      switchMap((token: AuthJwtDto) => {
        this.isRefreshing = false;
        this.tokenService.saveToken(token.access_token);
        this.tokenService.saveRefreshToken(token.refresh_token);
        this.refreshTokenSubject.next(token.access_token);
        return next.handle(this.addTokenHeader(request, token.access_token));
      }),
      catchError((err) => {
        this.isRefreshing = false;
        this.tokenService.signOut();
        return throwError(err);
      }),
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const access_token = this.tokenService.getToken();
      const refreshToken = this.tokenService.getRefreshToken();
      if (access_token && refreshToken) {
        return this.refreshToken$(request, next, access_token, refreshToken);
      }
    }
    this.tokenService.clear();
    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token))),
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const authInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }];
