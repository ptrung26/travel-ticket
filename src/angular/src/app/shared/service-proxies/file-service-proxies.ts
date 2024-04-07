import { Observable } from '@node_modules/rxjs';
import { BaseService } from '@service-proxies/base-service-proxies';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BlobContainerType } from '@service-proxies/CustomsType';
import { ApiNameConfig, UrlServices } from '@service-proxies/service-url-config/url-services';

@Injectable({providedIn: 'root'})
export class FileServiceProxies extends BaseService {
  constructor(
    @Inject(HttpClient) http: HttpClient) {
    super();
    this.http = http;
  }

  uploadAnh(
    image: FileParameter | undefined,
    blobContainer: BlobContainerType,
    width?: number | null | undefined,
    height?: number | null | undefined,
  ): Observable<FileDto> {
    let url_ = '';
    if (
      blobContainer === 'NhomMonAn' ||
      blobContainer === 'NhomThucPham' ||
      blobContainer === 'MonAn' ||
      blobContainer === 'ThucPham' ||
      blobContainer === 'DonVi' ||
      blobContainer === 'DoiTuongTDD'
    ) {
      // this.baseUrl = UrlServices.ngoaiKiemUrl();
      // url_ = `/api/${ApiNameConfig.ngoaiKiem.apiName}/file/UploadAnh?`;
      
    }  else {
    }

    if (url_ === '') {
      throw new Error('Xem lại type!!!!');
    }

    if (width !== undefined && width !== null) {
      url_ += 'width=' + encodeURIComponent('' + width) + '&';
    }
    if (height !== undefined && height !== null) {
      url_ += 'height=' + encodeURIComponent('' + height) + '&';
    }

    const content_ = new FormData();
    if (image === null || image === undefined) {
      // tslint:disable-next-line:quotemark
      throw new Error("The parameter 'image' cannot be null.");
    } else {
      content_.append('image', image.data, image.fileName ? image.fileName : 'image');
    }
    this.options_.body = content_;
    url_ = url_.replace(/[?&]$/, '');
    return this.requestToServer('post', url_, this.options_);
  }
}

export interface FileParameter {
  data: any;
  fileName: string;
}

export class FileDto {
  fileName!: string;
  fileType!: string | undefined;
  fileToken!: string;
  fileBytes!: string | undefined;
  fileBase64!: string | undefined;
}
