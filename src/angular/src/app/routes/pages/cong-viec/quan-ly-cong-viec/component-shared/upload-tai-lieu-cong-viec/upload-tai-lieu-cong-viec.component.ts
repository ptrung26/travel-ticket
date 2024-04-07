import { Component, forwardRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { NzUploadChangeParam, NzUploadComponent, NzUploadFile } from '@node_modules/ng-zorro-antd/upload';
import { AppConsts } from '@shared/AppConsts';
import { ApiNameConfig } from '@service-proxies/service-url-config/url-services';
import { AppComponentBase } from '@shared/common/AppComponentBase';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@node_modules/@angular/forms';
import { ViewPdfSharedComponent } from '@shared/customize-comp/view-pdf/view-pdf.component';

interface IUpload {
  url: string;
  path: string;
  name: string;
  fileName: string;
  status: boolean;
  type: string;
  msg: string;
  token: string;
}

@Component({
  selector: 'upload-tai-lieu-cong-viec',
  templateUrl: './upload-tai-lieu-cong-viec.component.html',
  styleUrls: ['./upload-tai-lieu-cong-viec.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadTaiLieuCongViecComponent),
      multi: true,
    },
  ],
})
export class UploadTaiLieuCongViecComponent extends AppComponentBase implements OnInit, ControlValueAccessor {
  @ViewChild('upload') uploadComponent: NzUploadComponent;
  fileList: IUpload[] = [];
  setOfId = new Set<string>();
  isOpen = false;
  nzAction = AppConsts.abpEnvironment.apis.congViec.url + `/api/${ApiNameConfig.congViec.apiName}/file/UploadFile`;
  isUploading = false;
  control = new FormControl();

  @Input() isEnableAdd: boolean = true;

  //impliments
  onChange: any = Function.prototype;

  onTouched: any = Function.prototype;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      this.isUploading = true;
    }
    if (info.file.status === 'done') {
      this.fileList.push(this.transferData(info.file));
      this.onChange(JSON.stringify(this.getDataList()));
      this.isUploading = false;
    } else if (info.file.status === 'error') {
      ora.notify.error('Tệp ' + info.file.name + ' tải lên không thành công!');
      this.isUploading = false;
    }
  }

  transferData(file: NzUploadFile): IUpload {
    const result = file.response.result.lstDataResult[0];
    return ({
      url: result.url,
      path: result.path,
      name: result.name,
      fileName: result.fileName,
      status: result.status,
      type: result.type,
      msg: result.msg,
      token: result.token,
    });
  }

  getDataList() {
    return this.fileList.filter(x => !this.setOfId.has(x.fileName));
  }

  themTaiLieu() {
    this.uploadComponent.uploadComp.onClick();
  }

  viewFileList() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }


  removeFile(data: IUpload, index: number) {
    this.fileList.splice(index, 1);
    this.setOfId.add(data.fileName);
    this.onChange(JSON.stringify(this.getDataList()));
  }

  viewFile(data: IUpload) {
    const path = AppConsts.abpEnvironment.apis.congViec.url + `/api/${ApiNameConfig.congViec.apiName}/file/gotoviewbyfilename/${data.fileName}`;
    this.modalHelper
      .create(
        ViewPdfSharedComponent,
        { path: path },
        {
          size: 'xl',
          includeTabs: false,
          modalOptions: {
            nzTitle: 'Xem tệp đính kèm',
          },
        },
      )
      .subscribe((result) => {

      });
  }

  writeValue(value: string): void {
    this.fileList = [];
    if (value && value !== '[]') {
      const parse = JSON.parse(value) as IUpload[];
      this.fileList.push(...parse);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

}
