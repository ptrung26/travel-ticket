import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TokenStorageService } from '@app/routes/auth/services/token.service';
import { PagedListingComponentBase, PagedRequestDto } from '@app/shared/common/paged-listing-component-base';
import {
  GetListUserCoSoRequest,
  GetPermissionListResultDto,
  ImportMultiUserRequest,
  ImportUserDto,
  LockUserRequest,
  OrganizationunitsServiceProxy,
  PermissionBaseCustomServiceProxy,
  PermissionManagementServiceProxy,
  SysOrganizationunitsDto,
  SysRoleServiceProxy,
  SysUserDto,
  TaiKhoanBaseCustomServiceProxy,
  UserSessionDto,
} from '@app/shared/service-proxies/tai-khoan-service-proxies';
import { PermissionService } from '@node_modules/@abp/ng.core';
import { NzModalService } from '@node_modules/ng-zorro-antd/modal';
import * as XLSX from '@node_modules/xlsx';
import { AccountPasswordlessLoginQuery, AccountServiceProxy } from '@service-proxies/danh-muc-service-proxies';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CrudDataTableService } from 'src/app-ord-base/services/crud-data-table.service';
import { DestroyRxjsService } from 'src/shared/destroy-rxjs.service';
import { ChangePwdUserAdminComponent } from './modal/change-pwd-user-admin.component';
import { CreateOrUpdateUserModalComponent } from './modal/create-or-update-user-modal.component';
import { PermissionTreeUserComponent } from './modal/permission-tree-user/permission-tree-user.component';
import { UserStateFormService } from './services/user-state-form.service';

@Component({
  selector: 'app-user-co-so',
  templateUrl: './user-co-so.component.html',
  styleUrls: ['./user-co-so.component.scss'],
  providers: [DestroyRxjsService],
})
export class UserCoSoComponent extends PagedListingComponentBase<SysUserDto> implements OnInit, AfterViewInit {
  rfFormGroup: FormGroup;
  apiName = 'taiKhoan';
  listSysUerId = [];
  searchChange$ = new BehaviorSubject('');
  listDataFromExcel = [];
  userSession: UserSessionDto;
  allPermission: GetPermissionListResultDto;
  grantedPermission = {
    canAdd: false,
    canEdit: false,
    canRemove: false,
    canLoginWithOther: true,
  };
  //#region Phòng ban
  arrPhongBan: any = [];
  Temp: any = [];

  constructor(
    injector: Injector,
    private crudService: CrudDataTableService,
    private modalService: NzModalService,
    private taiKhoan: TaiKhoanBaseCustomServiceProxy,
    private state: UserStateFormService,
    public permission: PermissionService,
    private account_SP: AccountServiceProxy,
    private tokenStorageService: TokenStorageService,
    private sysRoleService: SysRoleServiceProxy,
    private fb: FormBuilder,
    private permissionBaseCustomService: PermissionBaseCustomServiceProxy,
    private permissionManagerService: PermissionManagementServiceProxy,
    private _organizationunitsServiceProxy: OrganizationunitsServiceProxy,
  ) {
    super(injector);
    this.crudService.apiName = this.apiName;
  }

  ngOnInit(): void {
    this.taiKhoan.vaitrousercombobox().subscribe((res) => {
      this.listSysUerId = res;
    });
    this.userSession = JSON.parse(sessionStorage.getItem('userSession'));
    this.state.reset();
    this.rfFormGroup = this.fb.group({
      filter: '',
      listSysRoleId: [],
    });

    this.refresh();
  }

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    const input: GetListUserCoSoRequest = new GetListUserCoSoRequest();
    input.maxResultCount = request.maxResultCount;
    input.skipCount = request.skipCount;
    input.sorting = request.sorting;
    const formValue = this.rfFormGroup.value;
    input.filter = formValue.filter;
    input.listSysRoleId = formValue.listSysRoleId;
    this.taiKhoan
      .getlistv2(input)
      .pipe(finalize(finishedCallback))
      .subscribe((result) => {
        this.dataList = result.items;
        this.showPaging(result);
      });
  }

  ngAfterViewInit(): void {
    this.permissionBaseCustomService.byRoleSysUser().subscribe((res) => {
      this.allPermission = res;
    });
  }

  editPermission(data: SysUserDto) {
    ora.ui.setBusy();
    this.permissionManagerService
      .permissionUserGet(data.id)
      .pipe(
        finalize(() => {
          ora.ui.clearBusy();
        }),
      )
      .subscribe((res) => {
        if (res.isSuccessful) {
          this.modalHelper
            .create(
              PermissionTreeUserComponent,
              {
                per: res.dataResult,
                sysUserId: data.id,
              },
              {
                size: 'md',
                includeTabs: false,
                modalOptions: {
                  nzTitle: 'Chỉnh sửa quyền',
                },
              },
            )
            .subscribe((result) => {
              if (result) {
                this.refresh();
              }
            });
        }
      });
  }

  openModal(dataItem: any) {
    const params: any = {
      skipCount: 0,
      maxResultCount: 100,
    };
    ora.ui.setBusy();
    this._organizationunitsServiceProxy
      .getList(params)
      .pipe(finalize(ora.ui.clearBusy))
      .subscribe((response) => {
        let ret = response.items;
        this.addToArray(ret, null, null);
        this.arrPhongBan = this.Temp;
        this.Temp = [];
        let icon = '<span id="full-screen" class="fas fa-expand full-screen"></span>';
        const modal = this.modalService.create({
          nzTitle: (dataItem?.id != null ? 'Cập nhật tài khoản' : 'Thêm mới tài khoản') + icon,
          nzContent: CreateOrUpdateUserModalComponent,
          nzComponentParams: {
            dataItem: dataItem || {},
            initDataCreate: {
              isActive: true,
            },
            sysUser: dataItem,
            arrPhongBan: this.arrPhongBan,
          },
          nzFooter: null,
          nzWidth: '50%',
        });

        modal.afterClose.subscribe((result) => {
          this.refresh();
        });
      });
  }

  doiMatKhau(record: SysUserDto) {
    this.modalService.create({
      nzTitle: 'Đổi mật khẩu tài khoản',
      nzContent: ChangePwdUserAdminComponent,
      nzComponentParams: {
        id: record.id,
        record,
      },
    });
  }

  xoa(record: SysUserDto) {
    this.modalService.confirm({
      nzTitle: 'Xác nhận trước khi xóa',
      nzContent: `Bạn có chắc xóa tài khoản: "${record.userName}" này không?`,
      nzOnOk: () => {
        ora.ui.setBusy();
        // let req = new XoaTaiKhoanRequest();
        // req.userId = record.userId;

        this.taiKhoan
          .xoaTaiKhoan(record.userId)
          .pipe(finalize(ora.ui.clearBusy))
          .subscribe((d) => {
            if (d.isSuccessful) {
              ora.notify.success('Xóa thành công tài khoản: ' + record.userName);
              this.refresh();
              return;
            }
            ora.notify.error(d.errorMessage);
          });
      },
      nzOkText: 'Có',
    });
  }

  lock(record) {
    this.modalService.confirm({
      nzTitle: 'Xác nhận trước khi khóa',
      nzContent: `Bạn có chắc khóa tài khoản: "${record.userName}" này không?`,
      nzOnOk: () => {
        ora.ui.setBusy();
        const req = new LockUserRequest();
        req.userId = record.userId;
        req.isLock = true;
        this.taiKhoan
          .lockUser(req)
          .pipe(finalize(ora.ui.clearBusy))
          .subscribe((d) => {
            ora.notify.success('Khóa thành công tài khoản: ' + record.userName);
            record.isLock = true;
          });
      },
      nzOkText: 'Có',
    });
  }

  unlock(record) {
    this.modalService.confirm({
      nzTitle: 'Xác nhận trước khi mở khóa',
      nzContent: `Bạn có chắc mở khóa tài khoản: "${record.userName}" này không?`,
      nzOnOk: () => {
        ora.ui.setBusy();
        const req = new LockUserRequest();
        req.userId = record.userId;
        req.isLock = false;
        this.taiKhoan
          .lockUser(req)
          .pipe(finalize(ora.ui.clearBusy))
          .subscribe((d) => {
            ora.notify.success('Mở khóa thành công tài khoản: ' + record.userName);
            record.isLock = false;
          });
      },
      nzOkText: 'Có',
    });
  }

  onSendMail($event: any) {
    ora.ui.setBusy();
    // const funreturn = this.onUpload;
    this.listDataFromExcel = [];
    const formData = new FormData();
    const file = $event.target.files[0];
    formData.append('file', file);

    const that = this;
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      const arrayBuffer: any = fileReader.result;
      let data = new Uint8Array(arrayBuffer);
      let arr = new Array();
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      let bstr = arr.join('');
      let workbook = XLSX.read(bstr, { type: 'binary' });

      const sheet_name = workbook.SheetNames[0];
      const dataJSON = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name], { header: 1, raw: true, defval: '' });
      if (dataJSON.length > 0) {
        this.listDataFromExcel = dataJSON;
      }
      let listData: ImportUserDto[] = [];
      let rowData = [];
      this.listDataFromExcel.forEach((item, index) => {
        if (index > 0) {
          rowData = Object.values(item);
          const mapData = new ImportUserDto();
          mapData.userV1Id = rowData[0];
          mapData.userName = rowData[1].toString();
          mapData.email = rowData[2].toString();
          mapData.hoTen = rowData[3].toString();
          mapData.surName = rowData[4].toString();
          mapData.soDienThoai = rowData[5];
          if (rowData[6].toString() === '1') {
            mapData.isDeleted = true;
          } else {
            mapData.isDeleted = false;
          }
          if (typeof rowData[7] === 'number') {
            mapData.khachHangId = rowData[7];
          } else {
            mapData.khachHangId = null;
          }
          if (typeof rowData[8] === 'number') {
            mapData.listRole = rowData[8].toString();
          }
          mapData.matKhau = rowData[9];
          listData.push(mapData);
        }
      });
      const input = new ImportMultiUserRequest();
      input.arrUserDto = listData;
      this.taiKhoan
        .sendpasswordmultiuser(input)
        .pipe(finalize(ora.ui.clearBusy))
        .subscribe((d) => {
          ora.ui.clearBusy();
          ora.notify.info('Gửi email thành công!!!');
        });
    };
    fileReader.readAsArrayBuffer(file);
  }

  getPermissions() {
    this.grantedPermission.canAdd = this.permission.getGrantedPolicy('User_Add');
    this.grantedPermission.canEdit = this.permission.getGrantedPolicy('User_Edit');
    this.grantedPermission.canRemove = this.permission.getGrantedPolicy('User_Remove');
    this.grantedPermission.canLoginWithOther = this.permission.getGrantedPolicy('User_LoginWithOther');
  }

  isCurrentAccount(id) {
    return this.userSession?.userId === id;
  }

  loginPasswordless(data) {
    ora.ui.setBusy();
    const input = new AccountPasswordlessLoginQuery();
    input.userId = data.userId;
    this.account_SP
      .passwordlessLogin(input)
      .pipe(
        finalize(() => {
          ora.ui.clearBusy();
        }),
      )
      .subscribe((result) => {
        this.tokenStorageService.setTokenLoginWithOtherAccount(result.access_token, result.refresh_token);
        location.href = '';
      });
  }

  editUser(data: SysUserDto) {
    const params: any = {
      skipCount: 0,
      maxResultCount: 100,
    };
    ora.ui.setBusy();
    this._organizationunitsServiceProxy
      .getList(params)
      .pipe(finalize(ora.ui.clearBusy))
      .subscribe((response) => {
        let ret = response.items;
        this.addToArray(ret, null, null);
        this.arrPhongBan = this.Temp;
        this.Temp = [];
        this.modalHelper
          .create(
            CreateOrUpdateUserModalComponent,
            {
              sysUser: data,
              dataItem: data,
              arrPhongBan: this.arrPhongBan,
            },
            {
              size: 'lg',
              includeTabs: false,
              modalOptions: {
                nzTitle: 'Chỉnh sửa tài khoản ' + data?.userName,
              },
            },
          )
          .subscribe((result) => {
            if (result) {
              this.refresh();
            }
          });
      });
  }

  addToArray(arrayOld: SysOrganizationunitsDto[], itemNew: NzTreeNodeOptions, pId: number) {
    if (pId == null) {
      let filter = arrayOld.filter((m) => m.pId === pId);
      if (filter.length > 0) {
        filter.forEach((item) => {
          let obj: NzTreeNodeOptions = {
            title: item.tenPhongBan,
            key: item.id.toString(),
            children: [],
            expanded: true,
            isLeaf: false,
          };
          itemNew = obj;
          this.Temp.push(itemNew);
          this.addToArray(arrayOld, itemNew, item.id);
        });
      }
    } else if (pId != null) {
      let filter = arrayOld.filter((m) => m.pId === pId);
      if (filter.length > 0) {
        filter.forEach((item) => {
          let checkArrChild = arrayOld.filter((m) => m.pId === item.id);
          let obj: NzTreeNodeOptions = {
            title: item.tenPhongBan,
            key: item.id.toString(),
            children: [],
            expanded: true,
            isLeaf: checkArrChild != null && checkArrChild.length > 0 ? false : true,
          };
          if (itemNew != null) {
            itemNew.children.push(obj);
          } else {
            itemNew = obj;
            this.Temp.push(itemNew);
            this.addToArray(arrayOld, itemNew, item.id);
          }
        });
        if (itemNew != null) {
          itemNew.children.forEach((item) => {
            this.addToArray(arrayOld, item, parseInt(item.key));
          });
        }
      }
      //}
    }
  }

  //#endregion
  sendThongBaoHeThong(): void {
    ora.ui.setBusy();
    this.taiKhoan
      .sendthongbaohethong()
      .pipe(finalize(ora.ui.clearBusy))
      .subscribe((result) => {
        ora.notify.success('Gửi email thành công!!!');
      });
  }
}
