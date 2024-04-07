import { Component, Injector, Input, OnInit } from '@angular/core';
import {
  CommonServiceProxy,
  CongViecDto,
  CongViecUserDto,
  DanhSachCongViecServiceProxy,
  MUC_DO_CONG_VIEC,
  ROLE_CONG_VIEC,
} from '@service-proxies/cong-viec-service-proxies';
import { FormBuilder, FormGroup } from '@node_modules/@angular/forms';
import { AppConsts } from '@shared/AppConsts';
import { differenceInCalendarDays } from 'date-fns';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { finalize } from '@node_modules/rxjs/internal/operators';

@Component({
  selector: 'view-cong-viec-ca-nhan',
  templateUrl: './view-cong-viec-ca-nhan.component.html',
  styleUrls: ['./view-cong-viec-ca-nhan.component.scss'],
})
export class ViewCongViecCaNhanComponent extends ModalComponentBase implements OnInit {
  @Input() congViec: CongViecDto;
  @Input() duAnId: number;
  @Input() permission: any;

  rfDataModal: FormGroup;
  listuser: CongViecUserDto[] = [];
  showEdit = false;
  listUser: CongViecUserDto[] = [];
  MUC_DO_CONG_VIEC = MUC_DO_CONG_VIEC;
  sourceAvatar = AppConsts.abpEnvironment.apis.taiKhoan.url + `/api/tai-khoan/file/GetAvatar?userId=`;

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0;
  };

  constructor(
    injector: Injector,
    private _commonService: CommonServiceProxy,
    private _dataService: DanhSachCongViecServiceProxy,
    private fb: FormBuilder,
  ) {
    super(injector);
    this.rfDataModal = this.fb.group({
      ten: [''],
      moTa: [''],
      mucDo: [''],
      ngayHoanThanh: [],
      idNhanVien: [],
    });
  }

  ngOnInit(): void {
    this.getUserNhanVien();
    if (this.congViec?.id) {
      this.rfDataModal.patchValue(this.congViec);
      if (this.congViec.listUser?.length) {
        this.rfDataModal.get('idNhanVien').setValue(this.congViec.listUser[0]?.sysUserId);
      }
    }
  }

  save() {
    ora.ui.setBusy();
    const formValue = this.rfDataModal.value;
    const input = this.congViec;
    input.ten = formValue.ten;
    input.moTa = formValue.moTa;
    input.mucDo = formValue.mucDo;
    input.ngayHoanThanh = formValue.ngayHoanThanh;
    input.isCaNhan = true;

    if (formValue.idNhanVien) {
      const data = new CongViecUserDto();
      data.congViecId = this.congViec.id;
      data.sysUserId = formValue.idNhanVien;
      input.listUser = [data];
    }

    this._dataService
      .createorupdatecongviec(input)
      .pipe(
        finalize(() => {
          ora.ui.clearBusy();
        }),
      )
      .subscribe((res) => {
        if (res.isSuccessful) {
          ora.notify.success('Chỉnh sửa thành công!');
          this.showEdit = false;
          this.congViec.ten = formValue.ten;
          this.congViec.moTa = formValue.moTa;
          this.congViec.mucDo = formValue.mucDo;
          this.congViec.ngayHoanThanh = formValue.ngayHoanThanh;
        } else {
          ora.notify.error('Có lỗi xảy ra');
        }
      });
  }

  getUserNhanVien() {
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

  edit() {
    this.showEdit = true;
  }

  cancelEdit() {
    this.showEdit = false;
    this.rfDataModal.patchValue(this.congViec);
  }

  getNzText(length: number) {
    return length > 2 ? '+' + (length - 2) : '';
  }

  percent(soViecDaHoanThanh: number, soViec: number) {
    return Math.ceil((soViecDaHoanThanh * 100) / soViec);
  }
}
