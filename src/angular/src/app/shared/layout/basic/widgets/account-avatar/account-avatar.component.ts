import {ConfigStateService} from '@abp/ng.core';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {AppConsts} from '@app/shared/AppConsts';
import {Observable, Observer} from '@node_modules/rxjs';
import {filter} from '@node_modules/rxjs/internal/operators';
import {NzUploadFile} from 'ng-zorro-antd/upload';
import {DestroyRxjsService} from 'src/shared/destroy-rxjs.service';

@Component({
  selector: 'app-account-avatar',
  templateUrl: './account-avatar.component.html',
  styles: [],
  providers: [DestroyRxjsService],
})
export class AccountAvatarComponent implements OnInit {
  uploading = false;
  fileList: NzUploadFile[] = [];
  titleBtn = 'Upload ảnh đại diện';
  userId = '';
  srcUrl;
  constructor(private http: HttpClient, private destroy$: DestroyRxjsService, private config: ConfigStateService) {}

  ngOnInit(): void {
    this.userId = this.config.getAll().currentUser.id;
    this.srcUrl = AppConsts.abpEnvironment.apis.taiKhoan.url + `/api/tai-khoan/file/GetAvatar?userId=${this.userId}`;
  }

  beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      if (!isJpgOrPng) {
        ora.notify.error('Chọn ảnh có định dạng (jpg/jpeg/png)', 'Lỗi');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 5;
      if (!isLt2M) {
        ora.notify.error('Chọn ảnh có kích thước không quá 5MB', 'Lỗi');
        observer.complete();
        return;
      }
      this.fileList = this.fileList.concat(file);
      observer.next(false);
      observer.complete();
    });
  };

  handleUpload(): void {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });
    this.uploading = true;
    const taiKhoanUrl = AppConsts.abpEnvironment.apis.taiKhoan.url;
    const req = new HttpRequest('POST', taiKhoanUrl + '/api/tai-khoan/file/UploadAvatar?width=128&height=128', formData, {});
    this.http
      .request(req)
      .pipe(filter((e) => e instanceof HttpResponse))
      .subscribe((result: any) => {
        if (result) {
          this.uploading = false;
          const req1 = new HttpRequest('GET', taiKhoanUrl + `/api/tai-khoan/file/GetAvatar?userId=${this.userId}`, {});
          this.http
            .request(req1)
            .pipe(filter((e) => e instanceof HttpResponse))
            .subscribe((res: any) => {
              if (res) {
              }
            });
          this.srcUrl = taiKhoanUrl + `/api/tai-khoan/file/GetAvatar?userId=${this.userId}`;
          var avatarMulti = document.querySelectorAll('#avatar');
          if (avatarMulti?.length > 0) {
            avatarMulti.forEach((a) => {
              a.removeAttribute('src');
              var srcAttr = document.createAttribute('src');
              a.setAttributeNode(srcAttr);
              a.setAttribute('src', this.srcUrl);
            });
          }
          ora.notify.success('Thay đổi ảnh đại diện thành công!');
        }
      });
  }

  imageError() {
    this.srcUrl = './assets/no-avatar.png';
  }
}
