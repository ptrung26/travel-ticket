import { AfterContentInit, Component, Injector, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { finalize } from 'rxjs/operators';

import {
  AddOrRemoveSysOrganizationunits,
  CreateOrUpdateUserRequest,
  OrganizationunitsServiceProxy,
  SysOrganizationunitsDto,
  SysUserDto,
  TaiKhoanBaseCustomServiceProxy,
} from '@app/shared/service-proxies/tai-khoan-service-proxies';
import { TYPE_VALIDATE } from '@app/shared/utils/AppEnums';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzTreeComponent, NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';
@Component({
  selector: 'app-create-or-update-user-modal',
  templateUrl: './create-or-update-user-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  //animations: [appModuleAnimation()],
})
export class CreateOrUpdateUserModalComponent implements AfterContentInit {
  @Input() dataItem: any;
  @Input() baseUrlApi = '';
  @Input() initDataCreate: any = null;
  @Input() sysUser: SysUserDto;
  @Input() arrPhongBan: any[];
  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent;
  baseUrlService = '/api/tai-khoan/TaiKhoan/';
  apiName = 'danhMuc';
  typeValidate = TYPE_VALIDATE;
  roles: any = [];
  rootRoles: any = [];
  isSaveSuccess = false;
  isLoadingBtn = false;
  isContinue = false;
  lengthRolesActive = 0;
  onInitPhongBanId: string[] = [];

  constructor(injector: Injector, private modal: NzModalRef, private _taiKhoanBaseService: TaiKhoanBaseCustomServiceProxy) {
    //super(injector);
  }
  ngAfterContentInit(): void {}
  getInfoUser(userId?: number) {
    ora.ui.setBusy();
    this._taiKhoanBaseService
      .userForEditNoAuthen(userId || 0)
      .pipe(finalize(ora.ui.clearBusy))
      .subscribe((res) => {
        this.dataItem = res.user;
        this.roles = res.roles;
        this.lengthRolesActive = res.roles.filter((x) => x.isActive)?.length;
        this.onInitPhongBanId = res.listIdSysOrganizationunits;
        this.rootRoles = res.roles;
      });
  }
  close(isSave?: boolean): void {
    this.modal.destroy();
  }

  ngOnInit(): void {
    this.getInfoUser(this.dataItem.id);
  }

  save() {
    let allPhongBanChecked = this.nzTreeComponent.getCheckedNodeList() as NzTreeNode[];
    let addPhongBan: AddOrRemoveSysOrganizationunits[] = [];
    let removePhongBan: AddOrRemoveSysOrganizationunits[] = [];
    this.addOrRemoveSysOrganizationunits(addPhongBan, removePhongBan, allPhongBanChecked, this.onInitPhongBanId);
    if (AppUtilityService.IsNullValidateForm('formUser')) {
      ora.notify.error('Bạn cần nhập đủ dữ liệu các trường có dấu * đỏ !!');
      return false;
    }
    const req = new CreateOrUpdateUserRequest();
    this.dataItem.userName = this.dataItem.userName.trim();
    req.userDto = this.dataItem;
    req.arrRoleIds = this.roles.filter((m) => m.isActive == true).map((m) => m.id);
    req.listAddSysOrganizationunits = addPhongBan;
    req.listRemoveSysOrganizationunits = removePhongBan;
    if (this.dataItem.isDoiMatKhau && this.dataItem.matKhau != this.dataItem.matKhauNhapLai) {
      ora.notify.error('Mật khẩu nhập lại không chính xác');
    } else {
      ora.ui.setBusy();
      this._taiKhoanBaseService
        .createOrUpdateUser(req)
        .pipe(finalize(ora.ui.clearBusy))
        .subscribe((dto) => {
          if (dto.isSuccessful) {
            ora.notify.success('Lưu thành công');
            //this.state.onSelectUser(dto.dataResult);
            this.modal.close(true);
          } else {
            ora.notify.error(dto.errorMessage);
            return;
          }
        });
    }
  }

  addOrRemoveSysOrganizationunits(
    addPhongBan: AddOrRemoveSysOrganizationunits[],
    removePhongBan: AddOrRemoveSysOrganizationunits[],
    allPhongBanChecked: NzTreeNode[],
    onInitPhongBanId: string[],
  ) {
    if (Array.isArray(allPhongBanChecked)) {
      if (onInitPhongBanId?.length > 0) {
        allPhongBanChecked?.forEach((response: NzTreeNode) => {
          let isAdd = onInitPhongBanId?.find((x: string) => x == response.key);
          if (!isAdd) {
            let item: AddOrRemoveSysOrganizationunits = new AddOrRemoveSysOrganizationunits({
              sysOrganizationunitsId: parseInt(response.key),
              sysUserId: this.sysUser?.id,
            });
            addPhongBan.push(item);
          }
        });
        onInitPhongBanId?.forEach((response: string) => {
          let isRemove = allPhongBanChecked?.find((x: NzTreeNode) => x.key == response);
          if (!isRemove) {
            let item: AddOrRemoveSysOrganizationunits = new AddOrRemoveSysOrganizationunits({
              sysOrganizationunitsId: parseInt(response),
              sysUserId: this.sysUser?.id,
            });
            removePhongBan.push(item);
          }
        });
      } else {
        allPhongBanChecked?.forEach((response: NzTreeNode) => {
          let item: AddOrRemoveSysOrganizationunits = new AddOrRemoveSysOrganizationunits({
            sysOrganizationunitsId: parseInt(response.key),
            sysUserId: this.sysUser?.id,
          });
          addPhongBan.push(item);
        });
      }
    }
  }

  //#region code thừa

  // clearFormInsertContinue() {
  //   this.dataItem = _.cloneDeep(this.initDataCreate || {});
  // }

  // fullScreenClick() {
  //   let idEle = '.full-screen';
  //   var iCheck = true;
  //   $(idEle).click(function () {
  //     if (iCheck) {
  //       $('.ng-trigger-modalContainer').addClass('ant-hidden');
  //       $('.ant-modal').addClass('ant-modal-full');
  //     } else {
  //       $('.ng-trigger-modalContainer').removeClass('ant-hidden');
  //       $('.ant-modal').removeClass('ant-modal-full');
  //     }

  //     iCheck = !iCheck;
  //   });
  // }

  // dropDrapModal() {
  //   let modalContent: any = $('.ant-modal-content');
  //   modalContent.draggable({
  //     handle: '.ant-modal-header',
  //   });
  // }

  // ngAfterViewInit(): void {
  //   // this.dropDrapModal();
  //   this.fullScreenClick();
  // }

  // changeDonVi(item?: any) {
  //   if (item != null) {
  //     this.dataItem.donViCoSoId = item.id;
  //     this.dataItem.level = item.level;
  //     let req: any = {
  //       level: this.dataItem.level,
  //       isXNSangLoc: item.isXNSangLoc,
  //       isXNKhangDinh: item.isXNKhangDinh,
  //       isDieuTri: item.isDieuTri,
  //     };
  //     this.getRoleByLevelCoSo(req);
  //     // this.nhanVienAuto.ngOnChanges()
  //   } else {
  //     this.dataItem.donViCoSoId = null;
  //     this.roles = [];
  //   }
  // }
  // getRoleByLevelCoSo(req) {
  //   ora.ui.setBusy();
  //   this._taiKhoanBaseService
  //     .getRoleByLevelCoSo(req)
  //     .pipe(finalize(ora.ui.clearBusy))
  //     .subscribe((res) => {
  //       this.roles = res;
  //     });
  // }
  // changeNV(item?: any) {
  //   if (item != null) {
  //     this.dataItem.nhanVienId = item.id;
  //     this.dataItem.hoTen = item.ten;
  //     this.dataItem.soDienThoai = item.dienThoai;
  //   }
  // }

  //#endregion
}
