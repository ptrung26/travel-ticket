import { Component, Injector, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import {
  BulkInsertCongViecRequest,
  CommonServiceProxy,
  CongViecDto,
  CongViecUserDto,
  CreateOrUpdateCongViecRequest,
  DanhSachCongViecServiceProxy,
  GetCongViecDangCayRequest,
  LEVEL_CONG_VIEC,
  ROLE_CONG_VIEC,
  TRANG_THAI_CONG_VIEC,
} from '@service-proxies/cong-viec-service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { finalize } from 'rxjs/operators';
import { differenceInCalendarDays } from 'date-fns';
import _ from 'lodash';

@Component({
  templateUrl: './create-or-edit-du-an.component.html',
  styleUrls: ['./create-or-edit-du-an.component.scss'],
})
export class CreateOrEditDuAnComponent extends ModalComponentBase implements OnInit {
  @Input() duAn: CongViecDto;
  @Input() isView: boolean;
  @Input() isCaNhan: boolean;
  @Input() permission: any;
  @Input() isClone?: boolean;
  data?: CongViecDto;

  rfDataModal: FormGroup;
  TRANG_THAI_CONG_VIEC = TRANG_THAI_CONG_VIEC;
  ROLE_CONG_VIEC = ROLE_CONG_VIEC;
  sourceAvatar = AppConsts.abpEnvironment.apis.taiKhoan.url + `/api/tai-khoan/file/GetAvatar?userId=`;
  listUser: CongViecUserDto[] = [];
  listNhanVien: CongViecUserDto[] = [];
  congViecTree: CongViecDto;

  disabledStartDate = (current: Date): boolean => {
    if (this.rfDataModal.value?.ngayKetThuc) {
      return differenceInCalendarDays(current, this.rfDataModal.get('ngayKetThuc').value.toJSDate()) > 0;
    } else {
      return differenceInCalendarDays(current, new Date()) < 0;
    }
  };

  disabledEndDate = (current: Date): boolean => {
    if (this.rfDataModal.value?.ngayBatDau) {
      return differenceInCalendarDays(current, this.rfDataModal.get('ngayBatDau').value.toJSDate()) < 0;
    } else {
      return differenceInCalendarDays(current, new Date()) < 0;
    }
  };

  constructor(injector: Injector, private _commonService: CommonServiceProxy,
    private _dataService: DanhSachCongViecServiceProxy, private fb: FormBuilder) {
    super(injector);
  }

  ngOnInit(): void {
    this.rfDataModal = this.fb.group({
      id: [0],
      ten: ['', Validators.required],
      moTa: [''],
      sysUserId: [0],
      isCaNhan: [this.permission.truongPhong],
      ngayBatDau: ['', [Validators.required]],
      ngayKetThuc: ['', [Validators.required]],
      listIdThanhVien: [],
      isUuTien: false,
      isCloneCongViec: false,
    });
    this.data = new CongViecDto();
    if (this.duAn?.id) {
      if (this.isClone) {
        this.data.ten = this.duAn.ten + "-Copy";
        this.data.moTa = this.duAn.moTa;
        this.data.listUser = [];

        const input = new GetCongViecDangCayRequest();
        input.id = this.duAn.id;
        input.level = 1;
        this._dataService.getcongviecdangcay(input).subscribe(res => {
          if (res.isSuccessful) {
            this.congViecTree = res.dataResult;
            console.log(this.congViecTree);
          }
        })
      } else {
        Object.assign(this.data, this.duAn);
      }
      this.rfDataModal.patchValue(this.data);
      this.rfDataModal.get('listIdThanhVien').setValue(this.data.listUser.map((x) => x.sysUserId));
    }
    this.getUserTruongPhong();
  }


  getUserTruongPhong() {
    ora.ui.setBusy();
    this._commonService
      .userCongViec(ROLE_CONG_VIEC.TRUONG_PHONG)
      .pipe(
        finalize(() => {
          ora.ui.clearBusy();
        }),
      )
      .subscribe((res) => {
        this.listUser = res.map(data => {
          data.anhDaiDien = AppConsts.abpEnvironment.apis.taiKhoan.url + `/api/tai-khoan/file/GetAvatar?userId=${data.userId}`;
          return data;
        });
      });
  }

  getCreateOrUpdateCongViecRequest() {
    const formValue = this.rfDataModal.value;
    const input = new CreateOrUpdateCongViecRequest();
    input.id = formValue.id;
    input.ten = formValue.ten;
    input.moTa = formValue.moTa;
    input.sysUserId = formValue.sysUserId;
    input.ngayBatDau = formValue.ngayBatDau;
    input.isCaNhan = formValue.isCaNhan;
    input.ngayKetThuc = formValue.ngayKetThuc;
    input.isUuTien = formValue.isUuTien;
    input.level = this.data?.id ? this.data.level : LEVEL_CONG_VIEC.DU_AN;
    input.trangThai = this.data?.id ? this.data.trangThai : TRANG_THAI_CONG_VIEC.TAO_MOI;
    return input;
  }

  createOrUpdateCongViec() {
    this._dataService
      .createorupdatecongviec(this.getCreateOrUpdateCongViecRequest())
      .pipe(
        finalize(() => {
          ora.ui.clearBusy();
        }),
      )
      .subscribe((res) => {
        if (res.isSuccessful) {
          let message = "Thêm mới dự án thành công";
          if (this.data) {
            message = "Chỉnh sửa thành công";
          }
          ora.notify.success(message);
          this.success(true);
        } else {
          ora.notify.error(res.errorMessage);
        }
      });
  }

  cloneCongViec() {
    let formValue = this.rfDataModal.value;
    if (this.rfDataModal.controls["isCloneCongViec"].value) {
      let input = new BulkInsertCongViecRequest();
      input.ten = formValue.ten;
      input.ngayBatDau = formValue.ngayBatDau;
      input.ten = formValue.ten;
      input.moTa = formValue.moTa;
      input.sysUserId = formValue.sysUserId;
      input.ngayBatDau = formValue.ngayBatDau;
      input.isCaNhan = formValue.isCaNhan;
      input.ngayKetThuc = formValue.ngayKetThuc;
      input.isUuTien = formValue.isUuTien;
      input.listUser = [];
      input.level = this.data?.id ? this.data.level : LEVEL_CONG_VIEC.DU_AN;
      input.trangThai = this.data?.id ? this.data.trangThai : TRANG_THAI_CONG_VIEC.TAO_MOI;
      this.cloneChildren(this.congViecTree);
      input.children = this.congViecTree.children;
      input.sysUserId = this.congViecTree.sysUserId;
      this._dataService.bulkinsertcongviec(input).pipe(
        finalize(() => {
          ora.ui.clearBusy();
        }),
      ).subscribe(res => {
        if (res.isSuccessful) {
          let message = "Nhân bản dự án thành công";
          ora.notify.success(message);
          this.success(true);
        } else {
          ora.notify.error(res.errorMessage);
        }
      })
    } else {
      this.createOrUpdateCongViec();
    }
  }

  cloneChildren(cv: CongViecDto) {
    cv.trangThai = TRANG_THAI_CONG_VIEC.TAO_MOI;
    delete cv.id;
    if (cv.children && cv.children.length > 0) {
      cv.children.forEach(child => {
        this.cloneChildren(child);
      });
    }
  }

  save(): void {
    if (this.rfDataModal.invalid) {
      ora.notify.error(this.l('Vui lòng kiểm tra lại thông tin'));
      for (const i in this.rfDataModal.controls) {
        this.rfDataModal.controls[i].markAsDirty();
        this.rfDataModal.controls[i].updateValueAndValidity();
      }
    } else {
      ora.ui.setBusy();
      if (!this.isClone) {
        this.createOrUpdateCongViec();
      } else {
        this.cloneCongViec();
      }

    }
  }

  getTruongPhongDuAn(): CongViecUserDto[] {
    const listIdThanhVien = this.rfDataModal.value.listIdThanhVien;
    if (listIdThanhVien && this.listUser?.length) {
      return this.listUser.filter(x => listIdThanhVien.some(s => +s === x.id));
    }
    return [];
  }

  getNhanVienDuAn(): CongViecUserDto[] {
    return this.data?.listUser?.filter(x => !this.listUser.some(s => s.id === x.sysUserId));
  }
}
