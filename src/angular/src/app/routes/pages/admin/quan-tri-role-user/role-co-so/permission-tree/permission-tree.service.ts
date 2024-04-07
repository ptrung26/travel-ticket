import { Injectable } from '@angular/core';
import { TranslatePipe } from '@node_modules/@ngx-translate/core';
import * as _ from 'lodash';
import { RestService } from '@node_modules/@abp/ng.core';
import { switchMap } from '@node_modules/rxjs/internal/operators';
import { TreeNode } from '@node_modules/primeng/api';
import { Observable, of } from '@node_modules/rxjs';
import { PermissionManagementServiceProxy } from '@app/shared/service-proxies/tai-khoan-service-proxies';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';

interface IPermissionGroupDto {
  name: string;
  displayName: string;
  permissions: IPermissionItemDto[];
}

export interface IPermissionItemDto {
  name: string;
  displayName: string;
  parentName: string;

  // thêm mới không có trong data api trả về
  children?: any[];
}

@Injectable()
export class PermissionTreeService {
  isReadOnly = false;
  permissions: IPermissionGroupDto[] = [];
  ignoreGroups = ['FeatureManagement', 'Saas', 'AuditLogging',
    'LanguageManagement', 'LeptonThemeManagement', 'TextTemplateManagement', 'newPMS', 'SA'];

  constructor(private translatePipe: TranslatePipe,
    private rest: RestService,
    private permissionmanagementServiceProxy: PermissionManagementServiceProxy) {

  }

  getDanhSachQuyen(isRoleStatic, benhVienId): Observable<TreeNode[]> {
    const api$ = this.permissionmanagementServiceProxy.getByRole({
      benhVienId: AppUtilityService.isNotNull(benhVienId) ? benhVienId : 0,
      isRoleStatic
    } as any);
    // this.rest.request<any, any>({
    //   method: 'GET',
    //   url: '/api/permission-management/permissions?providerName=R&providerKey=A'
    // });

    return api$.pipe(switchMap(dto => {
      this.permissions = _.filter(dto?.groups, (it) => {
        it.displayName = this.translatePipe.transform(_.trimEnd(it?.name, '.'));
        _.forEach(it.permissions, (premission) => {
          premission.displayName = this.translatePipe.transform(_.trimEnd(premission?.name, '.'));
        });
        return this.ignoreGroups.indexOf(it.name) === -1;
      });
      const treeData = this.builderTreeData();
      return of(treeData);
    }));
  }

  builderTreeData(): TreeNode[] {
    const data: TreeNode[] = [];
    _.forEach(this.permissions, (g) => {
      const nodeGroup: TreeNode = {
        label: g.displayName,
        data: g.name,
        children: this.unflatten(_.cloneDeep(g.permissions))
      };
      data.push(nodeGroup);
    });
    return data;
  }

  unflatten(list: IPermissionItemDto[]): any[] {
    // tslint:disable-next-line:no-shadowed-variable
    const map: any = {};
    let node;
    const roots: any[] = [];
    let i;

    for (i = 0; i < list.length; i += 1) {
      map[list[i].name] = i; // initialize the map
      list[i].children = []; // initialize the children
    }
    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      node.label = node?.displayName;
      node.data = node?.name;
      if (this.isReadOnly) {
        node.selectable = false;
      }
      if (AppUtilityService.isNotNull(node.parentName)) {
        list[map[node.parentName]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  getItemSelected(data: TreeNode[], listNameSelected: string[]): TreeNode[] {
    return _.compact(_.map(listNameSelected, (name) => {
      return this.findNodeByName(data, name);
    }));
  }

  findNodeByName(data: TreeNode[], name: string): TreeNode {
    let ret = null;
    _.forEach(data, (d) => {
      if (d.data === name) {
        ret = d;
        return false;
      }
      if (!AppUtilityService.isNotAnyItem(d.children)) {
        const f = this.findNodeByName(d.children, name);
        if (AppUtilityService.isNotNull(f)) {
          ret = f;
          return false;
        }
      }

    });
    return ret;
  }
}
