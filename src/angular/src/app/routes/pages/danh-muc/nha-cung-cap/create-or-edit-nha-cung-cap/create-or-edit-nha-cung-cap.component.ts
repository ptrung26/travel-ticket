import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModalComponentBase } from '@app/shared/common/modal-component-base';
import { CommonServiceProxy, NhaCungCapDto, NhaCungCapServiceProxy } from '@app/shared/service-proxies/danh-muc-service-proxies';
import { Observable, Observer, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, takeUntil } from 'rxjs/operators';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { AppConsts } from '@app/shared/AppConsts';
import { ApiNameConfig, UrlServices } from '@app/shared/service-proxies/service-url-config/url-services';
import { phoneValidate } from '@app/shared/customValidator/validation';

@Component({
  selector: 'create-or-edit-nha-cung-cap',
  templateUrl: './create-or-edit-nha-cung-cap.component.html',
})
export class CreateOrEditNhaCungCapComponent extends ModalComponentBase implements OnInit, OnDestroy {
  @Input() dataItem: NhaCungCapDto;
  rfDataModal: FormGroup;
  formSubmit$ = new Subject<any>();
  $destroy = new Subject<boolean>();
  uploadUrl = '';
  logoUrl?: string;
  publishUrl = UrlServices.danhMucUrl();
  logo = '';
  loadingAvatar = false;
  listPhanLoaiChuongTrinh = [];

  constructor(
    injector: Injector,
    private _dataService: NhaCungCapServiceProxy,
    private _commonService: CommonServiceProxy,
    private fb: FormBuilder,
  ) {
    super(injector);
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }

  ngOnInit(): void {
    this.uploadUrl = AppConsts.abpEnvironment.apis.danhMuc.url + `/api/${ApiNameConfig.danhMuc.apiName}/file/UploadLogo/NhaPhanPhoi/0`;
    this.rfDataModal = this.fb.group({
      id: [0],
      ten: ['', [Validators.required]],
      tenVietTat: ['', [Validators.required]],
      diaChi: ['', [Validators.required]],
      quocGiaId: ['', [Validators.required]],
      tinhId: ['', [Validators.required]],
      huyenId: ['', [Validators.required]],
      xaId: ['', [Validators.required]],
      truSo: [''],
      daiDien: [''],
      phanLoai: [null, [Validators.required]],
      soDangKyKinhDoanh: ['', [Validators.required]],
      logo: [''],
      tenNguoiDaiDien: [''],
      emailNguoiDaiDien: ['', [Validators.email]],
      dienThoaiNguoiDaiDien: ['', [phoneValidate]],
      listChuongTrinh: [],
      trangThai: [true],
    });
    if (this.dataItem) {
      if (!this.logo) {
        this.logo = this.dataItem.logo;
      }
      this.rfDataModal.patchValue(this.dataItem);
      this.rfDataModal.controls['phanLoai'].patchValue(this.dataItem.phanLoai.split(','));
      this.logoUrl = this.publishUrl + '/' + this.dataItem.logo;
    }
    this.initDiaChinh();
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
      let input = new NhaCungCapDto();
      input = this.rfDataModal.value;
      input.phanLoai = this.rfDataModal.value.phanLoai.toString();
      input.logo = this.logo;
      this._dataService
        .insertorupdatenhacungcap(input)
        .pipe(
          finalize(() => {
            ora.ui.clearBusy();
          }),
          takeUntil(this.$destroy),
        )
        .subscribe((result) => {
          if (result.isSuccessful) {
            ora.notify.success(input.id ? 'Chỉnh sửa nhà phân phối thành công' : 'Tạo mới nhà phân phối thành công');
            this.success(true);
          } else {
            ora.notify.error(result.errorMessage);
          }
        });
    }
  }

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        ora.notify.error('Vui lòng tải lên ảnh có định dạng png, jpg');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 <= 2;
      if (!isLt2M) {
        ora.notify.error('Hình ảnh tải lên không quá 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loadingAvatar = true;
        break;
      case 'done':
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loadingAvatar = false;
          this.logoUrl = img;
          this.logo = info.file?.response?.result?.lstDataResult[0]?.path;
        });
        break;
      case 'error':
        ora.notify.error('Hình ảnh tải lên không thành công!');
        this.loadingAvatar = false;
        break;
    }
  }


  initDiaChinh() {
    this.rfDataModal
      .get('tinhId')
      .valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.$destroy))
      .subscribe((res) => {
        if (!res) {
          this.rfDataModal.get('huyenId').setValue(null);
          this.rfDataModal.get('xaId').setValue(null);
        }
      });

    this.rfDataModal
      .get('huyenId')
      .valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.$destroy))
      .subscribe((res) => {
        if (!res) {
          this.rfDataModal.get('xaId').setValue(null);
        }
      });
  }
}
