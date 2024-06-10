import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { AppConsts } from '@app/shared/AppConsts';
import {
  CreateOrUpdateNhaCungCapVeRequest,
  GetNCCVeByIdRequest,
  NhaCungCapVeDto,
  NhaCungCapVeServiceProxy
} from '@app/shared/service-proxies/danh-muc-service-proxies';
import { ApiNameConfig } from '@app/shared/service-proxies/service-url-config/url-services';
import { FormBuilder } from '@ngneat/reactive-forms';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { finalize } from 'rxjs/operators';
import { IUpload } from '../../../resource/common.dto';

@Component({
  selector: 'crud-nha-cung-cap-ve',
  templateUrl: './crud-nha-cung-cap-ve.component.html',
  styleUrls: ['./crud-nha-cung-cap-ve.component.scss'],
})
export class CreateOrUpdateNhaCungCapVeComponent implements OnInit, AfterViewInit {
  rfForm: FormGroup;
  @Input() id?: number;
  @Output() closeEvent = new EventEmitter();
  title: string = 'Thêm mới';
  uploadUrl: string = AppConsts.abpEnvironment.apis.danhMuc.url + `/api/${ApiNameConfig.danhMuc.apiName}/file/UploadFile`;
  loading: boolean = false;
  avatarUrl: string = '';
  dataItem?: NhaCungCapVeDto;

  constructor(private fb: FormBuilder, private _dataService: NhaCungCapVeServiceProxy) {
    this.rfForm = this.fb.group({
      ma: ['', [Validators.required]],
      ten: ['', [Validators.required]],
      quocGiaId: null,
      tinhId: null,
      diaChi: '',
      email: ['',],
      fax: ['', [Validators.required]],
      maSoThue: ['', [Validators.required]],
      SoSaoDanhGia: [null],
      ngayHetHanHopDong: [null],
      website: [""],
      moTa: [""],
      tinhTrang: [true],
    });

  }
  ngOnInit(): void {
    ora.ui.setBusy();
    if (this.id > 0) {
      this.title = 'Chỉnh sửa thông tin';
      const input = new GetNCCVeByIdRequest();
      input.id = this.id;
      this._dataService.getbyid(input).subscribe(res => {
        ora.ui.clearBusy();
        if (res.isSuccessful) {
          this.dataItem = res.dataResult;
          this.rfForm.patchValue(this.dataItem);
        } else {
          ora.notify.error(res.errorMessage);
        }
      })
    }
  }

  ngAfterViewInit(): void {
    if (!this.id) {
      ora.ui.clearBusy();
    }
  }

  save() {
    if (this.rfForm.invalid) {
      for (let i in this.rfForm.controls) {
        this.rfForm.controls[i].markAsDirty();
        this.rfForm.controls[i].updateValueAndValidity();
      }

      ora.notify.error('Vui lòng xem lại thông tin!');
    } else {
      const input = new CreateOrUpdateNhaCungCapVeRequest();
      Object.assign(input, this.rfForm.value);
      if (this.id > 0) {
        input.id = this.id;
      }
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
            if (this.id) {
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
      console.log(this.avatarUrl);
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
