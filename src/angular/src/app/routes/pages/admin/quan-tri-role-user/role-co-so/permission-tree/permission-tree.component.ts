import {
  AfterViewInit,
  Component,
  Injector,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import * as _ from 'lodash';

import { TranslatePipe } from '@node_modules/@ngx-translate/core';
import { PermissionTreeService } from './permission-tree.service';

import {
  PermissionManagementServiceProxy,
  SysRoleDto, TreeNodePermissionNameDto,
  TreePermissionDto, UpdatePermissionRoleDto,
} from '@service-proxies/tai-khoan-service-proxies';
import { NzTreeComponent, NzTreeNode } from '@node_modules/ng-zorro-antd/tree';
import { finalize } from '@node_modules/rxjs/internal/operators';


@Component({
  selector: 'permission-tree-role',
  templateUrl: './permission-tree.component.html',
  styleUrls: ['./permission-tree.component.scss'],
  providers: [PermissionTreeService, TranslatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class PermissionTreeComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() dataItem: SysRoleDto;
  @ViewChildren('nzTreeComponent') nzTreeComponents!: QueryList<NzTreeComponent>;
  checkStrictly = true;
  permissions: TreePermissionDto[] = [];
  per: TreeNodePermissionNameDto[];

  constructor(
    injector: Injector,
    private _translatePipe: TranslatePipe,
    private _permissionService: PermissionManagementServiceProxy) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataItem?.currentValue) {
      this.getPermissionForRole(changes.dataItem.currentValue);
    }
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.checkStrictly = false;
  }

  translate() {
    this.per?.map((x: TreeNodePermissionNameDto) => {
      x.title = this._translatePipe.transform(_.trimEnd(x.title));
      this.translateChildren(x.listTreePermission);
    });
  }

  translateChildren(array: TreePermissionDto[]) {
    array.forEach((x: TreePermissionDto) => {
      x.title = this._translatePipe.transform(_.trimEnd(x.title));
      if (x.children?.length) {
        this.translateChildren(x.children);
      }
    });
  }

  countPermission() {
    this.per?.map((x: TreeNodePermissionNameDto) => {
      x.count = 0;
      this.countChildren(x.listTreePermission, x);
    });
  }

  countChildren(array: TreePermissionDto[], item: TreeNodePermissionNameDto) {
    array.forEach((x: TreePermissionDto) => {
      if (x.checked || x.isHalfChecked) {
        item.count++;
      }
      if (x.children?.length) {
        this.countChildren(x.children, item);
      }
    });
  }

  createTreePermissionFromTreeNode(item: NzTreeNode) {
    return new TreePermissionDto({
      title: item.title,
      key: item.key,
      checked: true,
      disableCheckbox: item.isDisableCheckbox,
      expanded: item.isExpanded,
      isLeaf: item.isLeaf,
      children: [],
      isHalfChecked: item.isHalfChecked,
    });
  }

  addPermissionsRole(array: NzTreeNode[]) {
    array?.forEach((item: NzTreeNode) => {
      if (!item.isDisableCheckbox && (item.isChecked || item.isHalfChecked)) {
        const permission = this.createTreePermissionFromTreeNode(item);
        this.permissions = [...this.permissions, permission];
      }
      if (item.getChildren()?.length > 0) {
        this.addPermissionsRole(item.getChildren());
      }
    });
  }

  getPermissionForRole(data: SysRoleDto) {
    ora.ui.setBusy();
    this._permissionService.permissionRoleGet(data.id).pipe(finalize(() => {
      ora.ui.clearBusy();
    })).subscribe(res => {
      if (res.isSuccessful) {
        this.per = res.dataResult;
        this.translate();
        this.countPermission();
      }
    });
  }

  checkboxChange(event: any) {
   this.countPermission();
  }

  save(): boolean {
    this.permissions = [];
    this.nzTreeComponents.forEach(item => {
      let permissionTree = item.getTreeNodes();
      this.addPermissionsRole(permissionTree);
    });
    const input = new UpdatePermissionRoleDto();
    input.sysRoleId = this.dataItem?.id;
    input.permissions = this.permissions.map(x => x.key);
    ora.ui.setBusy();
    this._permissionService.permissionRolePut(input).pipe(finalize(() => {
      ora.ui.clearBusy();
    })).subscribe(res => {
      if (res.isSuccessful) {
        ora.notify.success(`Cập nhật thành công quyền ${this.dataItem.ten}`);
        return true;
      } else {
        ora.notify.error(res.errorMessage);
        return false;
      }
    });
    return null;
  }
}
