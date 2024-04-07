import { Component, Injector, Input, OnInit } from '@angular/core';
import { base64ToFile, ImageCroppedEvent } from '@node_modules/ngx-image-cropper';
import { BlobContainerType } from '@service-proxies/CustomsType';
import { FileParameter, FileServiceProxies } from '@service-proxies/file-service-proxies';
import { NzModalRef } from '@node_modules/ng-zorro-antd/modal';
import { ModalComponentBase } from '@shared/common/modal-component-base';

export interface IDataImgOut {
  imgByte: string | undefined;
  fileToken: string | undefined;
}

@Component({
  templateUrl: './img-temp-modal.component.html',
})
export class ImgTempModalComponent extends ModalComponentBase implements OnInit {
  @Input() imgWidthNeed = 128;
  @Input() aspectRatio = true;
  @Input() blobContainer: BlobContainerType;
  public saving = false;
  public temporaryPictureUrl: string;
  private temporaryPictureFileName: string;
  imgBase64AfterCrop = '';
  imageChangedEvent: any = '';
  nzModalRef: NzModalRef;

  constructor(injector: Injector, private fileService: FileServiceProxies) {
    super(injector);
    this.nzModalRef = injector.get(NzModalRef);
  }

  ngOnInit() {
    this.initializeModal();
  }

  private initializeModal(): void {
    this.temporaryPictureUrl = '';
    this.temporaryPictureFileName = '';
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCroppedFile(event: ImageCroppedEvent) {
    this.imgBase64AfterCrop = event.base64;
  }

  save(): void {
    const img = {
      data: <File>base64ToFile(this.imgBase64AfterCrop),
      fileName: 'fileImg',
    } as FileParameter;
    this.saving = true;
    this.fileService.uploadAnh(img, this.blobContainer).subscribe((res) => {
      this.saving = false;
      this.success({
        imgByte: this.imgBase64AfterCrop,
        fileToken: res.fileToken,
      } as IDataImgOut);
    });
  }
}
