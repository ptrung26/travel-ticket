import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import { debounceTime, finalize, takeUntil } from '@node_modules/rxjs/internal/operators';
import { NzModalService } from '@node_modules/ng-zorro-antd/modal';
import { DestroyRxjsService } from 'src/shared/destroy-rxjs.service';
import { InputSetPermissionForSysRoleDto, SysRoleDto, SysRoleServiceProxy } from '@app/shared/service-proxies/tai-khoan-service-proxies';
import { RoleCoSoStateService } from '../role-co-so-state.service';
import { PermissionTreeComponent } from '../permission-tree/permission-tree.component';

@Component({
  selector: 'app-permission-grant-for-role',
  templateUrl: './permission-grant-for-role.component.html',
  styleUrls: ['./permission-grant-for-role.component.scss'],
  providers: [DestroyRxjsService]
})
export class PermissionGrantForRoleComponent implements OnInit {
  @ViewChild('vcPermissionTree') vcPermissionTree: PermissionTreeComponent;
  roleDto: SysRoleDto;
  @Output() editEvent = new EventEmitter();
  permissionsSelected: string[] = [];
  @Output() reloadGridEvt = new EventEmitter();

  constructor(private state: RoleCoSoStateService,
    private roleSp: SysRoleServiceProxy,
    private destroy$: DestroyRxjsService,
    private modal: NzModalService) {
  }

  ngOnInit(): void {
    this.state.itemSelected$
      .pipe(takeUntil(this.destroy$))
      .pipe(debounceTime(500))
      .subscribe(dto => {
        this.roleDto = dto;
        this.getPermissionDaDuocGan();
      });
  }

  getPermissionDaDuocGan() {
    this.permissionsSelected = [];
    if (this.roleDto?.id > 0) {
      this.roleSp.getPermissionGranted(+this.roleDto.id).subscribe((result) => {
        this.permissionsSelected = result?.permissionNames || [];
      });
    }
  }

  edit() {
    this.editEvent.emit(this.roleDto);
  }

  delete() {
    if (this.roleDto?.id > 0) {
      this.modal.confirm({
        nzTitle: 'Xác nhận',
        nzContent: `Bạn có muốn xóa quyền: <b>"${this.roleDto.ten}"</b> này không?`,
        nzOnOk: () => {
          ora.ui.setBusy();
          this.roleSp.xoaRoleCoSo(+this.roleDto.id)
            .pipe(finalize(ora.ui.clearBusy))
            .subscribe(dto => {
              if (dto.isSuccessful) {
                ora.notify.info('Gán quyền thành công');
                // this.vcPermissionTree.isDaSelect = false;
                this.state.selectRoleRow(null);
                this.reloadGridEvt.emit();
                return;
              } else {
                ora.notify.error(dto.errorMessage, 'Không xóa được');
              }
            });
        }
      });

    }
  }

  luuPermission() {
    if (this.roleDto?.id > 0) {
      this.modal.confirm({
        nzTitle: 'Xác nhận',
        nzContent: `Bạn có muốn gán các chức năng đã chọn cho quyền: <b>"${this.roleDto.ten}"</b> này không?`,
        nzOnOk: () => {
          //const req: SetPermissionForSysRoleRequest = new SetPermissionForSysRoleRequest();
          const req: InputSetPermissionForSysRoleDto = new InputSetPermissionForSysRoleDto();
          req.sysRoleId = this.roleDto.id;
          req.permissionNames = this.permissionsSelected;
          ora.ui.setBusy();
          this.roleSp.setPermissionForSysRole(req)
            .pipe(finalize(ora.ui.clearBusy))
            .subscribe(dto => {
              ora.notify.info('Gán quyền thành công');
              // this.vcPermissionTree.isDaSelect = false;
            });
        }
      });

    }

  }
}
