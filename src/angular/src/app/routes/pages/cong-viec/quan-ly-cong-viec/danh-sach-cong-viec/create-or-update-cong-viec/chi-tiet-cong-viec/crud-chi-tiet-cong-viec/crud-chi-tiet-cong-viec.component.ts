import { Component, Injector, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@node_modules/@angular/forms';
import {
  CommonServiceProxy,
  CongViecDto,
  CongViecUserDto,
  CreateOrUpdateCongViecRequest,
  DanhSachCongViecServiceProxy,
  LEVEL_CONG_VIEC,
  ROLE_CONG_VIEC,
  TRANG_THAI_CONG_VIEC,
} from '@service-proxies/cong-viec-service-proxies';
import { finalize } from '@node_modules/rxjs/internal/operators';
import { AppConsts } from '@shared/AppConsts';
import { differenceInCalendarDays } from 'date-fns';
import { ModalComponentBase } from '@shared/common/modal-component-base';

@Component({
  selector: 'crud-chi-tiet-cong-viec',
  templateUrl: './crud-chi-tiet-cong-viec.component.html',
  styleUrls: ['./crud-chi-tiet-cong-viec.component.scss'],
})
export class CrudChiTietCongViecComponent extends ModalComponentBase implements OnInit {
  @Input() duAnId: number;
  @Input() congViec: CongViecDto;
  @Input() congViecNho: CongViecDto;
  @Input() permission: any;

  rfFormData: FormGroup;
  listUser: CongViecUserDto[] = [];
  TRANG_THAI_CONG_VIEC = TRANG_THAI_CONG_VIEC;

  disabledDate = (current: Date): boolean => {
    if (!this.congViecNho?.ngayHoanThanh) {
      return differenceInCalendarDays(current, new Date()) < 0;
    } else {
      return differenceInCalendarDays(current, this.congViecNho?.ngayHoanThanh.toJSDate()) > 0;
    }
  };

  constructor(
    injector: Injector,
    private _fb: FormBuilder,
    private _commonService: CommonServiceProxy,
    private _dataService: DanhSachCongViecServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.rfFormData = this._fb.group({
      id: [0],
      ten: [{ value: '', disabled: this.permission.nhanVien }, Validators.required],
      parentId: [],
      ngayHoanThanh: [{ value: '', disabled: this.permission.nhanVien }, Validators.required],
      sysUserId: [
        {
          value: '',
          disabled: this.permission.nhanVien || this.congViec?.trangThai > TRANG_THAI_CONG_VIEC.DANG_THUC_HIEN,
        },
        Validators.required,
      ],
      isHoanThanh: [
        {
          value: null,
          disabled:
            this.congViec?.trangThai > TRANG_THAI_CONG_VIEC.DANG_THUC_HIEN || (!this.congViecNho?.isMyCongViec && this.permission.nhanVien),
        },
      ],
      trangThai: [TRANG_THAI_CONG_VIEC.TAO_MOI],
      level: [LEVEL_CONG_VIEC.MUC_VIEC_NHO],
    });
    this.getAllNhanVien();
    this.rfFormData.patchValue(this.congViecNho);
    if (this.congViecNho?.listUser?.length) {
      this.rfFormData.get('sysUserId').setValue(this.congViecNho?.listUser[0].sysUserId);
    }
  }

  save() {
    if (this.rfFormData.invalid) {
      ora.notify.error(this.l('Vui lòng kiểm tra lại thông tin'));
      for (const i in this.rfFormData.controls) {
        this.rfFormData.controls[i].markAsDirty();
        this.rfFormData.controls[i].updateValueAndValidity();
      }
    } else {
      ora.ui.setBusy();
      const req = this.getCreateOrUpdateCongViecRequest();
      this._dataService
        .createorupdatecongviec(req)
        .pipe(
          finalize(() => {
            ora.ui.clearBusy();
          }),
        )
        .subscribe((res) => {
          if (res.isSuccessful) {
            this.success();
            ora.notify.success(req?.id ? 'Chỉnh sửa dữ liệu thành công' : 'Thêm mới công việc thành công');
          } else {
            ora.notify.error('Có lỗi xảy ra!');
          }
        });
    }
  }

  getAllNhanVien() {
    ora.ui.setBusy();
    this._commonService
      .userCongViec(ROLE_CONG_VIEC.NHAN_VIEN)
      .pipe(
        finalize(() => {
          ora.ui.clearBusy();
        }),
      )
      .subscribe((res) => {
        this.listUser = res.map((data) => {
          data.anhDaiDien = AppConsts.abpEnvironment.apis.taiKhoan.url + `/api/tai-khoan/file/GetAvatar?userId=${data.userId}`;
          return data;
        });
      });
  }

  getCreateOrUpdateCongViecRequest(): CreateOrUpdateCongViecRequest {
    const formValue = this.rfFormData.getRawValue();
    const congViecUser = new CongViecUserDto();
    congViecUser.sysUserId = formValue.sysUserId;
    congViecUser.congViecId = formValue.id;

    const response = new CreateOrUpdateCongViecRequest();
    response.id = formValue.id;
    response.ten = formValue.ten;
    response.parentId = this.congViec?.id;
    response.ngayHoanThanh = formValue.ngayHoanThanh;
    response.trangThai = formValue.trangThai;
    response.level = formValue.level;
    response.sysUserId = this.congViecNho?.sysUserId;
    response.isHoanThanh = formValue.isHoanThanh;
    response.listUser = [congViecUser];
    return response;
  }

  // getAllNhanVien() {
  //   const key = 'user-nhan-vien-cong-viec';
  //   const item = sessionStorage.getItem(key);
  //
  //   if (item && item !== '[]') {
  //     this.listUser = JSON.parse(sessionStorage.getItem(key));
  //   } else {
  //     ora.ui.setBusy();
  //     this._commonService
  //       .userCongViec(ROLE_CONG_VIEC.NHAN_VIEN)
  //       .pipe(
  //         finalize(() => {
  //           ora.ui.clearBusy();
  //         }),
  //       )
  //       .subscribe((res) => {
  //         this.listUser = res.map(data => {
  //           data.anhDaiDien = AppConsts.abpEnvironment.apis.taiKhoan.url + `/api/tai-khoan/file/GetAvatar?userId=${data.userId}`;
  //           return data;
  //         });
  //         sessionStorage.setItem(key, JSON.stringify(this.listUser));
  //       });
  //   }
  // }
}
