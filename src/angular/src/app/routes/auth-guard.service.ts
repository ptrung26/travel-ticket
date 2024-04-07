import {Injectable} from '@angular/core';
import {AuthService, PermissionService} from '@node_modules/@abp/ng.core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@node_modules/@angular/router';
import {OAuthService} from '@node_modules/angular-oauth2-oidc';
import {Observable, of} from '@node_modules/rxjs';
import {UserSessionDto} from '@service-proxies/tai-khoan-service-proxies';
import {AppSessionState} from '@app/stores/app-session/state';
import {Select} from '@node_modules/@ngxs/store';
import {map} from 'rxjs/operators';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild, CanLoad {
  @Select(AppSessionState.userSession) userSession$: Observable<UserSessionDto>;

  constructor(
    private permission: PermissionService,
    private _router: Router,
    private authService: AuthService,
    private oAuthService: OAuthService,
  ) {
  }

  private canActivateInternal(data: any, state: RouterStateSnapshot): Observable<boolean> {
    // if (this.oAuthService.hasValidAccessToken() === false) {
    //   this.authService.init().then((res) => {
    //     this.authService.navigateToLogin();
    //   });
    // }
    return this.userSession$.pipe(map((user) => {
      if (!user) {
        this._router.navigateByUrl('/account/login').then();
        return false;
      }
      if (!data || !data['permission']) {
        return true;
      }
      if (this.permission.getGrantedPolicy(data['permission'])) {
        return true;
      }
      this._router.navigate([this.selectBestRoute()]);
      return false;
    }));
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivateInternal(route.data, state);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // console.log('CanLoad', route);
    return this.canActivateInternal(route.data, null);
  }

  selectBestRoute(): string {
    return '/not-permission';
  }
}
