import { Injectable } from '@angular/core';
import { SysUserDto } from '@app/shared/service-proxies/tai-khoan-service-proxies';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BaseStateService } from 'src/shared/base-state.service';

interface State {
  userSelected: SysUserDto;
}

const initialState: State = {
  userSelected: null,
};

@Injectable({
  providedIn: 'root'
})
export class UserStateFormService extends BaseStateService<State> {
  userSelected$ = this.select(s => s.userSelected);

  constructor(
    //private taiKhoanSp: TaikhoancosoServiceProxy
    private modalService: NzModalService,
  ) {
    super(initialState);
  }
  public openDsCoSoChuaCoTKModal(option: {
    callBack: any;
  }): void {
    let sTitle = 'Danh sách cơ sở chưa có tài khoản';
    let icon = '<span id="full-screen" class="fas fa-expand full-screen"></span>';
    const modal = this.modalService.create({
      nzTitle: sTitle + icon,
      //nzContent: DSCoSoChuaCoTKModalComponent,

      nzComponentParams: {
        //dataItem: option.dataItem || {},
      },
      nzFooter: null,
      nzWidth: "70%"
    });

    modal.afterClose.subscribe(result => {
      option.callBack(result);
    });
  }

  reset() {
    this.setState({
      ...initialState
    });
    this.getListSysAppPrivateRoleDto();
  }

  onSelectUser(record: SysUserDto) {
    // if (record?.id > 0) {
    //   this.taiKhoanSp.getlistdacauhinhsysapp(+record.id).subscribe(d => {
    //     this.setState({
    //       userSelected: record,
    //       listSysAppDaCauHinh: d
    //     });
    //   });
    // } else {
    //   this.setState({
    //     userSelected: record
    //   });
    // }

  }

  getListSysAppPrivateRoleDto() {
    // this.taiKhoanSp.getlistcauhinhsysappprivate().subscribe(dto => {
    //   this.setState({
    //     listSysAppPrivateRoleDto: dto
    //   });
    // });
  }
}
