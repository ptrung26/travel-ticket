import { NzModalRef } from '@node_modules/ng-zorro-antd/modal';
import { Component, Input, OnInit } from '@angular/core';
import { SysRoleServiceProxy } from '@app/shared/service-proxies/tai-khoan-service-proxies';

@Component({
  selector: 'nz-modal-custom-footer-component',
  template: `
      <h5 class="font-weight-bold text-primary margin-top-20">DANH SÁCH CHỨC NĂNG </h5>
      <div>
<!--          <app-permission-tree #vcPermissionTree [(listPermissionNameSelected)]="permissionsSelected"-->
<!--                               [isReadOnly]="true"-->
<!--                               [isRoleStatic]="false"></app-permission-tree>-->
      </div>
      <div *nzModalFooter>
          <button nz-button nzType="default" (click)="destroyModal()">Đóng</button>
      </div>
  `
})
export class PermissionForRoleModalComponent implements OnInit {
  @Input() id = 0;
  permissionsSelected = [];

  constructor(private modal: NzModalRef,
    private roleSp: SysRoleServiceProxy) {
  }

  destroyModal(): void {
    this.modal.destroy();
  }

  ngOnInit(): void {
    if (this.id > 0) {
      this.roleSp.getPermissionGranted(+this.id).subscribe((result) => {
        this.permissionsSelected = result?.permissionNames || [];
      });
    }
  }
}
