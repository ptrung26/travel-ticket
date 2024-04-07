import { PagedResultDto } from '@node_modules/@abp/ng.core';
import { BaseService } from '@service-proxies/base-service-proxies';
import { Observable } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DateTime, Duration } from 'luxon';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

//region Permissions
@Injectable({providedIn: 'root'})
export class PermissionsServiceProxies extends BaseService {
  constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    super();
    this.http = http;
    this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : '';
  }

  getPermission(providerName: 'R' | 'U', providerKey: string): Observable<GetPermissionListResultDto> {
    let url_ = '/api/permission-management/permissions?';
    if (providerName === undefined || providerName === null) {
      throw new Error("The parameter 'providerName' must be defined.");
    }

    if (providerName !== undefined && providerName !== null) {
      url_ += 'providerName=' + encodeURIComponent('' + providerName) + '&';
    }
    if (providerKey !== undefined && providerKey !== null) {
      url_ += 'providerKey=' + encodeURIComponent('' + providerKey) + '&';
    }
    url_ = url_.replace(/[?&]$/, '');

    return this.requestToServer('get', url_, this.options_);
  }

  updatePermission(
    providerName: 'R' | 'U',
    providerKey: string,
    permission: UpdatePermissionDto[],
  ): Observable<GetPermissionListResultDto> {
    let url_ = '/api/permission-management/permissions?';
    if (providerName === undefined || providerName === null) {
      throw new Error("The parameter 'providerName' must be defined.");
    }

    if (providerName !== undefined && providerName !== null) {
      url_ += 'providerName=' + encodeURIComponent('' + providerName) + '&';
    }
    if (providerKey !== undefined && providerKey !== null) {
      url_ += 'providerKey=' + encodeURIComponent('' + providerKey) + '&';
    }
    url_ = url_.replace(/[?&]$/, '');
    this.options_.body = {
      permissions: permission,
    };

    return this.requestToServer('put', url_, this.options_);
  }
}

export class GetPermissionListResultDto {
  entityDisplayName!: string | undefined;
  groups!: PermissionGroupDto[] | undefined;
}

export class PermissionGroupDto {
  name!: string | undefined;
  displayName!: string | undefined;
  permissions!: PermissionGrantInfoDto[] | undefined;
}

export class PermissionGrantInfoDto {
  name!: string | undefined;
  displayName!: string | undefined;
  parentName!: string | undefined;
  isGranted!: boolean;
  allowedProviders!: string[] | undefined;
  grantedProviders!: ProviderInfoDto[] | undefined;
}

export class ProviderInfoDto {
  providerName!: string | undefined;
  providerKey!: string | undefined;
}

export class UpdatePermissionDto {
  name!: string | undefined;
  isGranted!: boolean;
}

//endregion end Permissions

//region User
@Injectable({providedIn: 'root'})
export class UserServiceProxies extends BaseService {
  constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    super();
    this.http = http;
    this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : '';
  }

  getUserServePaging(
    filter: string | null | undefined,
    sorting: string | null | undefined,
    skipCount: number | undefined,
    maxResultCount: number | undefined,
  ): Observable<PagedResultDto<IdentityUserDto>> {
    let url_ = '/api/identity/users?';
    if (filter !== undefined && filter !== null) {
      url_ += 'Filter=' + encodeURIComponent('' + filter) + '&';
    }
    if (sorting !== undefined && sorting !== null) {
      url_ += 'Sorting=' + encodeURIComponent('' + sorting) + '&';
    }
    if (skipCount === null) {
      throw new Error("The parameter 'skipCount' cannot be null.");
    } else if (skipCount !== undefined) {
      url_ += 'SkipCount=' + encodeURIComponent('' + skipCount) + '&';
    }
    if (maxResultCount === null) {
      throw new Error("The parameter 'maxResultCount' cannot be null.");
    } else if (maxResultCount !== undefined) {
      url_ += 'MaxResultCount=' + encodeURIComponent('' + maxResultCount) + '&';
    }
    url_ = url_.replace(/[?&]$/, '');

    return this.requestToServer('get', url_, this.options_);
  }

  delete(id: string): Observable<void> {
    let url_ = '/api/identity/users/{id}';
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    url_ = url_.replace('{id}', encodeURIComponent('' + id));
    url_ = url_.replace(/[?&]$/, '');

    return this.requestToServer('delete', url_, this.options_);
  }

  getRolesByUserId(id: string): Observable<{ items: IdentityRoleDto[] }> {
    let url_ = '/api/identity/users/{id}/roles';
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    url_ = url_.replace('{id}', encodeURIComponent('' + id));
    url_ = url_.replace(/[?&]$/, '');

    return this.requestToServer('get', url_, this.options_);
  }

  createUser(body: IdentityUserCreateDto | undefined): Observable<IdentityUserDto> {
    let url_ = '/api/identity/users';
    url_ = url_.replace(/[?&]$/, '');
    // const content_ = JSON.stringify(body);
    this.options_.body = body;
    return this.requestToServer('post', url_, this.options_);
  }

  updateUser(id: string, body: IdentityUserUpdateDto | undefined): Observable<IdentityUserDto> {
    let url_ = '/api/identity/users/{id}';
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    url_ = url_.replace('{id}', encodeURIComponent('' + id));
    url_ = url_.replace(/[?&]$/, '');

    // const content_ = JSON.stringify(body);
    this.options_.body = body;
    return this.requestToServer('put', url_, this.options_);
  }

  changePassword(id: string, newPassword: string): Observable<void> {
    let url_ = '/api/identity/users/{id}/change-password';
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    if (newPassword === undefined || newPassword === null) {
      throw new Error("The parameter 'newPassword' must be defined.");
    }
    url_ = url_.replace('{id}', encodeURIComponent('' + id));
    url_ = url_.replace(/[?&]$/, '');
    this.options_.body = {
      newPassword: newPassword,
    };
    return this.requestToServer('put', url_, this.options_);
  }
}

export class IdentityUserCreateDto {
  password!: string;
  userName!: string;
  name!: string | undefined;
  surname!: string | undefined;
  email!: string;
  phoneNumber!: string | undefined;
  lockoutEnabled!: boolean;
  roleNames!: string[] | undefined;
  organizationUnitIds!: string[] | undefined;
  readonly extraProperties!: { [key: string]: any } | undefined;
}

export class IdentityUserUpdateDto {
  password!: string | undefined;
  concurrencyStamp!: string | undefined;
  userName!: string;
  name!: string | undefined;
  surname!: string | undefined;
  email!: string;
  phoneNumber!: string | undefined;
  lockoutEnabled!: boolean;
  roleNames!: string[] | undefined;
  readonly extraProperties!: { [key: string]: any } | undefined;
}

export class IdentityUserDto {
  tenantId!: string | undefined;
  userName!: string | undefined;
  name!: string | undefined;
  surname!: string | undefined;
  email!: string | undefined;
  emailConfirmed!: boolean;
  phoneNumber!: string | undefined;
  phoneNumberConfirmed!: boolean;
  lockoutEnabled!: boolean;
  lockoutEnd!: DateTime | undefined;
  concurrencyStamp!: string | undefined;
  isDeleted!: boolean;
  deleterId!: string | undefined;
  deletionTime!: DateTime | undefined;
  lastModificationTime!: DateTime | undefined;
  lastModifierId!: string | undefined;
  creationTime!: DateTime;
  creatorId!: string | undefined;
  id!: string;
}

export class IdentityRoleDto {
  name!: string | undefined;
  isDefault!: boolean;
  isStatic!: boolean;
  isPublic!: boolean;
  concurrencyStamp!: string | undefined;
  id!: string;
  readonly extraProperties!: { [key: string]: any } | undefined;
}

//endregion endUser

//region Roles
@Injectable({providedIn: 'root'})
export class RolesServiceProxies extends BaseService {
  constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    super();
    this.http = http;
    this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : '';
  }

  getUserServePaging(
    filter: string | null | undefined,
    sorting: string | null | undefined,
    skipCount: number | undefined,
    maxResultCount: number | undefined,
  ): Observable<PagedResultDto<IdentityRoleDto>> {
    let url_ = '/api/identity/roles?';
    if (filter !== undefined && filter !== null) {
      url_ += 'Filter=' + encodeURIComponent('' + filter) + '&';
    }
    if (sorting !== undefined && sorting !== null) {
      url_ += 'Sorting=' + encodeURIComponent('' + sorting) + '&';
    }
    if (skipCount === null) {
      throw new Error("The parameter 'skipCount' cannot be null.");
    } else if (skipCount !== undefined) {
      url_ += 'SkipCount=' + encodeURIComponent('' + skipCount) + '&';
    }
    if (maxResultCount === null) {
      throw new Error("The parameter 'maxResultCount' cannot be null.");
    } else if (maxResultCount !== undefined) {
      url_ += 'MaxResultCount=' + encodeURIComponent('' + maxResultCount) + '&';
    }
    url_ = url_.replace(/[?&]$/, '');

    return this.requestToServer('get', url_, this.options_);
  }

  delete(id: string): Observable<void> {
    let url_ = '/api/identity/roles/{id}';
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    url_ = url_.replace('{id}', encodeURIComponent('' + id));
    url_ = url_.replace(/[?&]$/, '');

    return this.requestToServer('delete', url_, this.options_);
  }

  createRole(body: IdentityRoleCreateDto | undefined): Observable<IdentityRoleDto> {
    let url_ = '/api/identity/roles';
    url_ = url_.replace(/[?&]$/, '');
    // const content_ = JSON.stringify(body);
    this.options_.body = body;
    return this.requestToServer('post', url_, this.options_);
  }

  updateRole(id: string, body: IdentityRoleUpdateDto | undefined): Observable<IdentityRoleDto> {
    let url_ = '/api/identity/roles/{id}';
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }
    url_ = url_.replace('{id}', encodeURIComponent('' + id));
    url_ = url_.replace(/[?&]$/, '');

    // const content_ = JSON.stringify(body);
    this.options_.body = body;
    return this.requestToServer('put', url_, this.options_);
  }

  getAll(): Observable<{ items: IdentityRoleDto[] }> {
    let url_ = '/api/identity/roles/all';
    url_ = url_.replace(/[?&]$/, '');
    return this.requestToServer('get', url_, this.options_);
  }
}

export class IdentityRoleCreateDto {
  name!: string;
  isDefault!: boolean;
  isPublic!: boolean;
  readonly extraProperties!: { [key: string]: any } | undefined;
}

export class IdentityRoleUpdateDto {
  concurrencyStamp!: string | undefined;
  name!: string;
  isDefault!: boolean;
  isPublic!: boolean;
  readonly extraProperties!: { [key: string]: any } | undefined;
}

//endregion Roles
//region Profile
@Injectable({providedIn: 'root'})
export class ProfileServiceProxies extends BaseService {
  constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    super();
    this.http = http;
    this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : '';
  }

  changepassword(body: ChangePasswordInput | undefined): Observable<void> {
    let url_ = '/api/identity/my-profile/change-password';
    url_ = url_.replace(/[?&]$/, '');
    this.options_.body = body;
    return this.requestToServer('post', url_, this.options_);
  }

  getMyProfile(): Observable<ProfileDto> {
    let url_ = '/api/identity/my-profile';
    url_ = url_.replace(/[?&]$/, '');
    return this.requestToServer('get', url_, this.options_);
  }

  updateMyProfile(body: UpdateProfileDto | undefined): Observable<ProfileDto> {
    let url_ = '/api/identity/my-profile';
    url_ = url_.replace(/[?&]$/, '');
    this.options_.body = body;
    return this.requestToServer('put', url_, this.options_);
  }
}

export class UpdateProfileDto {
  userName!: string;
  email!: string | undefined;
  name!: string | undefined;
  surname!: string | undefined;
  phoneNumber!: string | undefined;
  readonly extraProperties!: { [key: string]: any } | undefined;
}

export class ProfileDto {
  userName!: string | undefined;
  email!: string | undefined;
  emailConfirmed!: boolean;
  name!: string | undefined;
  surname!: string | undefined;
  phoneNumber!: string | undefined;
  phoneNumberConfirmed!: boolean;
  isExternal!: boolean;
  hasPassword!: boolean;
  readonly extraProperties!: { [key: string]: any } | undefined;
}

export class ChangePasswordInput {
  currentPassword!: string | undefined;
  newPassword!: string;
}

//endregion Profile
