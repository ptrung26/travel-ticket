import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { AppConsts } from '@app/shared/AppConsts';
import { ModalComponentBase } from '@app/shared/common/modal-component-base';
import { ViewPdfSharedComponent } from '@app/shared/customize-comp/view-pdf/view-pdf.component';
import { CongViecDto, FileServiceProxy } from '@app/shared/service-proxies/cong-viec-service-proxies';
import { ApiNameConfig } from '@app/shared/service-proxies/service-url-config/url-services';
import { ControlValueAccessor, FormControl } from '@ngneat/reactive-forms';
import { NzUploadChangeParam, NzUploadComponent, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { finalize } from 'rxjs/operators';


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
  selector: 'upload-file-dinh-kem-modal',
  templateUrl: './upload-file-dinh-kem-modal.component.html',
  styleUrls: ['./upload-file-dinh-kem-modal.component.scss'],
})
export class UploadFileDinhKemModalComponent extends ModalComponentBase implements OnInit {
  @ViewChild('upload') uploadComponent: NzUploadComponent;
  @Input() dataItem: CongViecDto;
  @Input() onlyView: boolean = false;
  fileList: IUpload[] = [];
  setOfId = new Set<string>();
  isOpen = false;
  nzAction = AppConsts.abpEnvironment.apis.congViec.url + `/api/${ApiNameConfig.congViec.apiName}/file/UploadFile`;
  isUploading = false;
  jsonTaiLieu: string;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    if (this.dataItem.jsonTaiLieu) {
      this.fileList = JSON.parse(this.dataItem.jsonTaiLieu);
    }
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      this.isUploading = true;
    }
    if (info.file.status === 'done') {
      this.fileList.push(this.transferData(info.file));
      this.jsonTaiLieu = JSON.stringify(this.getDataList());
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
    this.jsonTaiLieu = JSON.stringify(this.getDataList());
  }

  downloadFile(file: IUpload) {
    const url = AppConsts.abpEnvironment.apis.congViec.url + `/api/${ApiNameConfig.congViec.apiName}/file/downloadfile/${file.fileName}`;
    window.open(url, '_self');
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

  save() {
    this.success(this.jsonTaiLieu);
  }


}
