import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { debounceTime, filter, finalize, take, takeUntil } from '@node_modules/rxjs/internal/operators';
import { NzModalService } from '@node_modules/ng-zorro-antd/modal';
import { UserStateFormService } from '../../services/user-state-form.service';
import { DestroyRxjsService } from 'src/shared/destroy-rxjs.service';
import { RoleAbleDto } from '@app/shared/service-proxies/tai-khoan-service-proxies';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';
import { PermissionForRoleModalComponent } from './permission-for-role-modal.component';

@Component({
  selector: 'app-phan-quyen-user',
  templateUrl: './phan-quyen-user.component.html',
  styleUrls: ['./phan-quyen-user.component.scss'],
  providers: [DestroyRxjsService]
})
export class PhanQuyenUserComponent implements OnInit {
  listOfRole: RoleAbleDto[] = [];
  isAllCheck = false;
  roleIdHienTai: number[] = [1];

  constructor(
    private state: UserStateFormService,
    private destroy$: DestroyRxjsService,
    private modalService: NzModalService) {
  }

  ngOnInit(): void {
    // this.taiKhoanSp.getdanhsachrole().subscribe(lst => {
    //   this.listOfRole = lst;
    //   this.state.userSelected$.pipe(takeUntil(this.destroy$))
    //     .pipe(debounceTime(300))
    //     .pipe(filter(u => AppUtilityService.isNotNull(u)))
    //     .subscribe(u => {
    //       this.roleIdHienTai = [];
    //       _.forEach(this.listOfRole, r => {
    //         r.isCheck = false;
    //       });
    //       if (u?.id > 0) {
    //         this.taiKhoanSp.getuserrole(+u.id).subscribe(ur => {
    //           if (ur) {
    //             this.roleIdHienTai = _.map(ur, it => {
    //               return it.sysRoleId;
    //             });
    //             _.forEach(this.listOfRole, r => {
    //               if (this.roleIdHienTai.indexOf(r.sysRoleId) > -1) {
    //                 r.isCheck = true;
    //               }
    //             });
    //           }
    //         });
    //       }

    //     });
    // });
  }

  onChangeCheckAll(all: boolean) {
    if (all) {
      _.forEach(this.listOfRole, r => {
        r.isCheck = true;
      });
      return;
    }
    _.forEach(this.listOfRole, r => {
      r.isCheck = false;
    });
  }

  onChangeCheckItem() {
    const fNotCheck = _.find(this.listOfRole, r => {
      return r.isCheck === false;
    });
    this.isAllCheck = AppUtilityService.isNullOrEmpty(fNotCheck);
  }

  showSaveBtn() {
    const roleCheck = _.map(_.filter(this.listOfRole, r => r.isCheck), rc => {
      return rc.sysRoleId;
    });
    return !(_.isEqual(roleCheck.sort(), this.roleIdHienTai.sort()));
  }

  luuPhanQuyen() {
    // this.state.userSelected$.pipe(take(1))
    //   .subscribe(u => {
    //     if (u.id > 0) {
    //       ora.ui.setBusy();
    //       const req = new SetRoleForUserRequest();
    //       req.sysUserId = u.id;
    //       req.listSysRoleId = _.map(_.filter(this.listOfRole, s => s.isCheck), rc => rc.sysRoleId);
    //       this.taiKhoanSp.setroleforuser(req)
    //         .pipe(finalize(ora.ui.clearBusy))
    //         .subscribe(dto => {
    //           ora.notify.info('Lưu phân quyền thành công');
    //           this.roleIdHienTai = req.listSysRoleId;
    //         });
    //     }

    //   });


  }

  viewPermission(record) {
    this.modalService.create({
      nzTitle: 'Quyền: ' + record?.ten,
      nzContent: PermissionForRoleModalComponent,
      nzWidth: 1100,
      nzComponentParams: {
        id: record.sysRoleId
      },
      nzStyle: {
        top: '20px'
      }
    });
  }
}
