import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { AppConsts } from '@app/shared/AppConsts';
import {
  CreateOrUpdateNhaCungCapKhachSanRequest,
  NhaCungCapKhachSanDto,
  NhaCungCapKhachSanServiceProxy,
  ViewDetailNhaCungCapKhachSanRequest,
} from '@app/shared/service-proxies/danh-muc-service-proxies';
import { ApiNameConfig } from '@app/shared/service-proxies/service-url-config/url-services';
import { FormBuilder } from '@ngneat/reactive-forms';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { finalize } from 'rxjs/operators';
import { IUpload, NGAY_TRONG_TUAN } from '../../../resource/common.dto';
import _ from 'lodash';

@Component({
  selector: 'create-or-update-khach-san',
  templateUrl: './create-or-update-khach-san.component.html',
  styleUrls: ['./create-or-update-khach-san.component.scss'],
})
export class CreateOrUpdateKhachSanComponent implements OnInit {
  rfForm: FormGroup;
  @Input() nhaCungCapId!: number;
  dataItem: NhaCungCapKhachSanDto;
  @Output() closeEvent = new EventEmitter();
  title: string = 'Thêm mới';
  uploadUrl: string = AppConsts.abpEnvironment.apis.danhMuc.url + `/api/${ApiNameConfig.danhMuc.apiName}/file/UploadFile`;
  loading: boolean = false;
  avatarUrl: string = '';
  ngayTrongTuan: number[] = [];
  dateOfWeeks: NGAY_TRONG_TUAN[] = [
    {
      value: 1,
      text: 'Hai',
    },
    {
      value: 2,
      text: 'Ba',
    },
    {
      value: 3,
      text: 'Tư',
    },
    {
      value: 4,
      text: 'Năm',
    },
    {
      value: 5,
      text: 'Sáu',
    },
    {
      value: 6,
      text: 'Bảy',
    },
    {
      value: 7,
      text: 'CN',
    },
  ];
  constructor(private fb: FormBuilder, private _dataService: NhaCungCapKhachSanServiceProxy) {
    this.rfForm = this.fb.group({
      ma: ['', [Validators.required]],
      ten: ['', [Validators.required]],
      quocGiaId: [null],
      tinhId: [null],
      diaChi: [''],
      email: ['', [Validators.required]],
      fax: ['', [Validators.required]],
      maSoThue: ['', [Validators.required]],
      soSao: null,
      isHasVAT: [false],
      website: [""],
      moTa: [""],
      ngayHetHanHopDong: [null],
      tinhTrang: [1],

    });
  }

  ngOnInit(): void {
    if (this.nhaCungCapId > 0) {
      this.title = 'Chỉnh sửa thông tin';
      const input = new ViewDetailNhaCungCapKhachSanRequest();
      input.id = this.nhaCungCapId;

      ora.ui.setBusy();
      this._dataService.viewdetail(input).pipe(finalize(() => {
        ora.ui.clearBusy();
      })).subscribe(res => {
        if (res.isSuccessful) {
          this.dataItem = res.dataResult;
          this.rfForm.patchValue(this.dataItem);
        }
      })
    }

  }

  handleChangeDate(value: number) {
    const idx = this.ngayTrongTuan.findIndex((x) => x === value);
    if (idx >= 0) {
      this.ngayTrongTuan.splice(idx, 1);
    } else {
      this.ngayTrongTuan.push(value);
    }

  }

  filterNgayCuoiTuan(value: number): boolean {
    return this.ngayTrongTuan.findIndex((x) => x === value) >= 0;
  }

  createOrUpdate() {
    if (this.rfForm.invalid) {
      for (let i in this.rfForm.controls) {
        this.rfForm.controls[i].markAsDirty();
        this.rfForm.controls[i].updateValueAndValidity();
      }

      ora.notify.error('Vui lòng xem lại thông tin!');
    } else {
      const input = new CreateOrUpdateNhaCungCapKhachSanRequest();
      Object.assign(input, this.rfForm.value);
      if (this.dataItem?.id > 0) {
        input.id = this.dataItem?.id;
      }
      input.ngayCuoiTuan = JSON.stringify(this.ngayTrongTuan);
      input.anhDaiDienUrl = JSON.stringify(this.avatarUrl);
      ora.ui.setBusy();
      this._dataService
        .createorupdate(input)
        .pipe(
          finalize(() => {
            ora.ui.clearBusy();
          }),
        )
        .subscribe((res) => {
          if (res.isSuccessful) {
            if (this.nhaCungCapId) {
              ora.notify.success('Chỉnh sửa thông tin thành công!');
            } else {
              ora.notify.success('Thêm mới thành công!');
            }
            this.close();
          } else {
            ora.notify.error(res.errorMessage);
          }
        });
    }
  }

  transferData(file: NzUploadFile): IUpload {
    const result = file.response.result.lstDataResult[0];
    return {
      url: result.url,
      path: result.path,
      name: result.name,
      fileName: result.fileName,
      status: result.status,
      type: result.type,
      msg: result.msg,
      token: result.token,
    };
  }

  handleChange(info: { file: NzUploadFile }): void {
    if (info.file.status !== 'uploading') {
      this.loading = true;
    }
    if (info.file.status === 'done') {
      const fileInfo = this.transferData(info.file);
      this.avatarUrl = JSON.stringify(fileInfo);
      this.loading = false;
    } else if (info.file.status === 'error') {
      ora.notify.error('Tệp ' + info.file.name + ' tải lên không thành công!');
      this.loading = false;
    }
  }

  close() {
    this.closeEvent.emit();
  }
}
