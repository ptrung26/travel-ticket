import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  CommonServiceProxy,
  CongViecDto,
  CongViecUserDto,
  DanhSachCongViecServiceProxy,
  GetCongViecByIdRequest,
  MUC_DO_CONG_VIEC,
  ROLE_CONG_VIEC,
} from '@service-proxies/cong-viec-service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { finalize } from 'rxjs/operators';
import { differenceInCalendarDays } from 'date-fns';
import { UploadTaiLieuCongViecComponent } from '../../component-shared/upload-tai-lieu-cong-viec/upload-tai-lieu-cong-viec.component';

@Component({
  templateUrl: './create-or-edit-cong-viec.component.html',
  styleUrls: ['./create-or-edit-cong-viec.component.scss'],
})
export class CreateOrEditCongViecComponent extends ModalComponentBase implements OnInit {
  @Input() congViec: CongViecDto;
  @Input() duAnId: number;
  @Input() permission: any;
  @Input() isCaNhan: boolean;

  rfDataModal: FormGroup;
  listuser: CongViecUserDto[] = [];
  showEdit = false;
  listUser: CongViecUserDto[] = [];
  MUC_DO_CONG_VIEC = MUC_DO_CONG_VIEC;
  sourceAvatar = AppConsts.abpEnvironment.apis.taiKhoan.url + `/api/tai-khoan/file/GetAvatar?userId=`;
  @ViewChild('upload') uploadComponent: UploadTaiLieuCongViecComponent;
  oldJsonTaiLieu: string;

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
      listIdThanhVien: [],
      jsonTaiLieu: [],
    });
  }


  ngOnInit(): void {
    this.getUserTruongPhong();

    if (this.congViec?.id) {
      this.getCongviec();
    }
  }



  getCongviec() {
    ora.ui.setBusy();
    const input = new GetCongViecByIdRequest();
    input.id = this.congViec.id;
    this._dataService
      .getcongviecbyid(input)
      .pipe(
        finalize(() => {
          ora.ui.clearBusy();
        }),
      )
      .subscribe((res) => {
        if (res) {
          this.congViec = res;
          this.rfDataModal.patchValue(this.congViec);
          this.rfDataModal.get('listIdThanhVien').setValue(this.congViec.listUser.map((x) => x.sysUserId));
          this.oldJsonTaiLieu = this.rfDataModal.controls["jsonTaiLieu"].value;
        }
      });
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
        this.listUser = res.filter(it => it.sysUserId !== null).map((data) => {
          data.anhDaiDien = AppConsts.abpEnvironment.apis.taiKhoan.url + `/api/tai-khoan/file/GetAvatar?userId=${data.userId}`;
          return data;
        });
      });
  }

  save() {
    ora.ui.setBusy();
    const formValue = this.rfDataModal.value;
    const input = this.congViec;
    input.ten = formValue.ten;
    input.moTa = formValue.moTa;
    input.mucDo = formValue.mucDo;
    input.ngayHoanThanh = formValue.ngayHoanThanh;
    input.jsonTaiLieu = formValue.jsonTaiLieu;
    input.listUser = formValue.listIdThanhVien?.map((id) => {
      const data = new CongViecUserDto();
      data.congViecId = this.congViec.id;
      data.sysUserId = id;
      return data;
    });
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

  edit() {
    this.showEdit = true;
  }

  cancelEdit() {
    this.showEdit = false;
    this.rfDataModal.patchValue(this.congViec);
    this.rfDataModal.get("jsonTaiLieu").setValue(this.oldJsonTaiLieu);
  }

  getNzText(length: number) {
    return length > 2 ? '+' + (length - 2) : '';
  }

  percent(soViecDaHoanThanh: number, soViec: number) {
    return Math.ceil((soViecDaHoanThanh * 100) / soViec);
  }

  // getUserTruongPhong() {
  //   const key = 'user-truong-phong-cong-viec';
  //   const item = sessionStorage.getItem(key);
  //
  //   if (item && item !== '[]') {
  //     this.listUser = JSON.parse(sessionStorage.getItem(key));
  //   } else {
  //     ora.ui.setBusy();
  //     this._commonService
  //       .userCongViec(ROLE_CONG_VIEC.TRUONG_PHONG)
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
