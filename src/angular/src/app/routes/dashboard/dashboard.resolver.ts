import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { UserExtensionServiceProxy, UserSessionDto } from '@app/shared/service-proxies/tai-khoan-service-proxies';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardResolver implements Resolve<UserSessionDto> {
  constructor(private _userExtension: UserExtensionServiceProxy) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserSessionDto> {
    return this._userExtension.userSession();
  }
}
