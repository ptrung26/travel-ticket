import { AfterViewInit, Component, Injector, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ModalComponentBase } from '@app/shared/common/modal-component-base';
import {
  PermissionManagementServiceProxy,
  TreeNodePermissionNameDto, TreePermissionDto, UpdatePermissionUserDto,
} from '@app/shared/service-proxies/tai-khoan-service-proxies';
import { TranslatePipe } from '@ngx-translate/core';
import * as _ from 'lodash';
import { NzTreeComponent, NzTreeNode } from 'ng-zorro-antd/tree';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'permission-tree-user',
  providers: [TranslatePipe],
  templateUrl: './permission-tree-user.component.html',
  styleUrls: ['./permission-tree-user.component.scss'],
})
export class PermissionTreeUserComponent extends ModalComponentBase implements OnInit, AfterViewInit {
  per: TreeNodePermissionNameDto[];
  sysUserId: number;
  permissions: TreePermissionDto[] = [];
  checkStrictly = true;
  @ViewChildren('nzTreeComponent') nzTreeComponents!: QueryList<NzTreeComponent>;

  constructor(injector: Injector, private translatePipe: TranslatePipe, private _permissionManagementService: PermissionManagementServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this.countPermission();
    this.translate();
  }

  ngAfterViewInit() {
    this.checkStrictly = false;
  }

  translate() {
    this.per.map((x: TreeNodePermissionNameDto) => {
      x.title = this.translatePipe.transform(_.trimEnd(x.title));
      this.translateChildren(x.listTreePermission);
    });
  }

  translateChildren(array: TreePermissionDto[]) {
    array.forEach((x: TreePermissionDto) => {
      x.title = this.translatePipe.transform(_.trimEnd(x.title));
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

  checkboxChange(event: any) {
    this.countPermission();
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

  addPermissions(array: NzTreeNode[]) {
    array?.forEach((item: NzTreeNode) => {
      if (!item.isDisableCheckbox && (item.isChecked || item.isHalfChecked)) {
        const permission = this.createTreePermissionFromTreeNode(item);
        this.permissions = [...this.permissions, permission];
      }
      if (item.getChildren()?.length > 0) {
        this.addPermissions(item.getChildren());
      }
    });
  }

  save() {
    this.permissions = [];
    this.nzTreeComponents.forEach(item => {
      let permissionTree = item.getTreeNodes();
      this.addPermissions(permissionTree);
    });
    const input = new UpdatePermissionUserDto();
    input.sysUserId = this.sysUserId;
    input.permissions = this.permissions.map(x => x.key);
    ora.ui.setBusy();
    this._permissionManagementService.permissionUserPut(input).pipe(finalize(() => {
      ora.ui.clearBusy();
    })).subscribe(res => {
      if (res.isSuccessful) {
        ora.notify.success('Cập nhật quyền thành công');
      } else {
        ora.notify.error(res.errorMessage);
      }
      this.success(true);
    });
  }
}
