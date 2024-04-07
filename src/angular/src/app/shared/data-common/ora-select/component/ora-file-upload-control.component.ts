import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { FileServiceProxy } from '@app/shared/service-proxies/danh-muc-service-proxies';
import { AppUtilityService } from '@shared/services/app-utility.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { v4 as uuid } from 'uuid';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

@Component({
  selector: 'ora-file-upload-control',
  template: `
    <div class="clearfix" style="display: block;">
      <p
        *ngIf="isView && isShowTitle"
        style="text-transform: uppercase; margin: 0px;
    color: #2F9DD7 !important;
    font-size: 18px !important;
    font-weight: bold;"
      >
        {{ sTitle }}
      </p>
      <ng-container *ngIf="!isHiddenKhoTaiLieuDaoTao">
        <button
          nz-button
          (click)="uploadFileKhoTaiLieu()"
          *ngIf="!isView && (!sLimit || sLimit > 1 || (sLimit == 1 && sModel.length == 0))"
        >
          <span nz-icon style="font-size: 15px; min-width: 20px; display: inline-block;" nzType="cloud-server" nzTheme="outline"></span>
          Tải lên từ kho tài liệu
        </button>
      </ng-container>

      <nz-upload
        [nzMultiple]="isMultiple"
        [nzAccept]="sAcceptFile"
        class="uploadfile-control ant-upload-{{ isView ? 'hideBox' : '' }}"
        [nzAction]="uploadUrl"
        [(nzFileList)]="fileList"
        (nzChange)="handleChange($event)"
        [nzBeforeUpload]="beforeUpload"
        [nzFileListRender]="fileListTpl"
      >
        <button nz-button class="upload-button" *ngIf="!isView && (!sLimit || sLimit > 1 || (sLimit == 1 && sModel.length == 0))">
          <span
            nz-icon
            nzType="laptop"
            nzTheme="outline"
            style="font-size: 15px !important; min-width: 20px; display: inline-block;"
          ></span>
          Tải lên từ máy tính
        </button>
      </nz-upload>
      <ng-template #fileListTpl let-list>
        <div style="width: 100% !important;" *ngIf="!isHide">
          <ng-container *ngFor="let item of fileList; index as idx">
            <div [ngClass]="{ fileItem: true, errors: !item.status }">
              <div>
                <svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  fill="currentColor"
                  width="1em"
                  height="1em"
                  class="ng-tns-c138-65"
                  data-icon="file"
                  aria-hidden="true"
                >
                  <path d="M534 352V136H232v752h560V394H576a42 42 0 01-42-42z" fill="#e6f7ff"></path>
                  <path
                    d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM602 137.8L790.2 326H602V137.8zM792 888H232V136h302v216a42 42 0 0042 42h216v494z"
                    fill="#1890ff"
                  ></path>
                </svg>
                <span>{{ item.name }}</span>
              </div>
              <div>
                <a (click)="downLoadFile(item)" nz-tooltip="Tải xuống"><i nz-icon nzType="download" nzTheme="outline"></i></a>
                <a (click)="removeFile(idx)" nzDanger nz-tooltip="Xóa" *ngIf="!isView"><i nz-icon nzType="delete" nzTheme="outline"></i></a>
              </div>
            </div>
          </ng-container>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .errors {
        color: #ff4d4f;
        border-color: #ff4d4f;
      }

      .fileItem {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
      }

      .fileItem div {
        display: flex;
        align-items: center;
      }

      .upload-button {
        margin-left: 12px;
        margin-bottom: 12px;
      }

      .fileItem + .fileItem {
        margin-top: 12px;
      }

      .fileItem div a {
        margin-left: 12px;
      }

      .fileItem div a i {
        font-size: 16px;
      }

      .fileItem svg {
        font-size: 20px;
        margin-right: 12px;
      }

      div:empty {
        display: none;
      }
    `,
  ],
})
export class OraFileUploadControlComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() isMultiple: boolean;
  @Input() sAcceptFile = '';
  @Input() listType: string[] = [];
  @Input() sLimit?: number;
  @Input() sTitle = 'File đính kèm';
  @Input() serviceName = '';
  @Input() urlApi = '';
  @Input() sModel: NzUploadFile[] = [];
  @Input() isView: boolean;
  @Input() isShowTitle: boolean;
  @Input() isHiddenKhoTaiLieuDaoTao = false;
  @Input() isHide: boolean;
  @Output() sModelChange = new EventEmitter();
  @Output() eventChange = new EventEmitter();
  fileList: NzUploadFile[] = [];
  step = 0;
  uploadUrl = '';
  Guid = uuid();
  arrFileAfterUpload = [];
  fileUploadExist = [];

  constructor(private modalService: NzModalService, private viewContainerRef: ViewContainerRef, private _fileService: FileServiceProxy) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.sModel) {
      this.fileList = changes.sModel.currentValue;
      if (this.step < 3) {
        this.fileUploadExist = this.fileList;
        this.step++;
      }
    }
  }

  ngAfterViewInit() {}

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
  };

  ngOnInit(): void {
    this.uploadUrl = this.urlApi + `/api/${this.serviceName}/file/UploadFile`;
    this.fileList = this.sModel;
  }

  beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]) => {
    this.sModel = this.Guid;
    this.Guid = uuid();
    return;
  };

  handleChange(info: any): void {
    this.arrFileAfterUpload = [];
    if (info.file.status === 'error') {
      info.file.message = info.file.error.error.message;
    }

    info.fileList.forEach((item) => {
      if (item.uid === info.file.uid) {
        item.message = info.file.message;
      }
      let res = item.response?.result?.lstDataResult;
      if (res != null) {
        this.arrFileAfterUpload.push(res[0]);
      } else {
        this.arrFileAfterUpload.push(item);
      }
    });
    this.sModelChange.emit(this.arrFileAfterUpload);
    this.eventChange.emit(info);
  }

  downLoadFile(item: any) {
    ora.ui.setBusy();
    let fileName = AppUtilityService.getFileNameByFilePath(item.url);
    // this._fileService
    //   .downloadfileupload(fileName)
    //   .pipe(
    //     finalize(() => {
    //       ora.ui.clearBusy();
    //     }),
    //   )
    //   .subscribe((res: FileDtoCommonResultDto) => {});
  }

  uploadFileKhoTaiLieu(): void {
    if (this.step < 3) {
      this.arrFileAfterUpload = this.sModel;
      this.step++;
    } else {
      this.fileUploadExist = this.arrFileAfterUpload;
    }

    // let modal: NzModalRef = this.modalService.create({
    //   nzTitle: 'Kho tài liệu',
    //   nzContent: ChooseFileKhoTaiLieuModalComponent,
    //   nzWidth: '1200px',
    //   nzViewContainerRef: this.viewContainerRef,
    //   nzComponentParams: {
    //     fileUploadExist: this.fileUploadExist,
    //     listType: this.listType,
    //   },
    //   nzFooter: null,
    // });
    // modal.afterClose.subscribe((result: KhoTaiLieuDaoTaoDto[]) => {
    //   if (result) {
    //     if (this.sLimit) {
    //       result = result.slice(-1);
    //     }
    //     result.forEach((item) => {
    //       let taiLieu = {
    //         url: item.urlTaiLieu,
    //         path: item.urlTaiLieu,
    //         fileName: item.urlTaiLieu.match(/^.*?([^\\/.]*)[^\\/]*$/)[1],
    //         name: item.tenTaiLieu,
    //         status: true,
    //         type: item.urlTaiLieu.substring(item.urlTaiLieu.lastIndexOf('.') + 1),
    //         msg: 'Thành công',
    //         token: null,
    //       };
    //       this.arrFileAfterUpload.push(taiLieu);
    //     });

    //     this.fileUploadExist = this.arrFileAfterUpload;
    //     this.sModelChange.emit(this.arrFileAfterUpload);
    //   }
    // });
  }

  removeFile(idx) {
    this.arrFileAfterUpload = [];
    this.fileList.splice(idx, 1);
    this.fileList.forEach((item) => {
      let res = item.response?.result?.lstDataResult;
      if (res != null) {
        this.arrFileAfterUpload.push(res[0]);
      } else {
        this.arrFileAfterUpload.push(item);
      }
    });
    this.fileUploadExist = this.arrFileAfterUpload;
    this.sModelChange.emit(this.arrFileAfterUpload);
  }
}
