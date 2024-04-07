import { PermissionService } from '@abp/ng.core';
import { Injectable, Injector } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseLocalService {
  private _permissionService: PermissionService;
  constructor(injector: Injector) {
    this._permissionService = injector.get(PermissionService);
  }

  isGranted(permissionName: string): boolean {
    return this._permissionService.getGrantedPolicy(permissionName);
  }

}
