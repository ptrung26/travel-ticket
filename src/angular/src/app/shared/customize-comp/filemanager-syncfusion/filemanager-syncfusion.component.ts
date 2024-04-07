import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { UrlServices } from '@app/shared/service-proxies/service-url-config/url-services';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { FileSelectEventArgs } from '@syncfusion/ej2-angular-filemanager';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'file-manager',
  templateUrl: './filemanager-syncfusion.component.html',
})
export class FileManagerSyncfusionComponent extends ModalComponentBase implements OnInit {
  @Output() fileSelect = new EventEmitter();
  public ajaxSettings: object;
  public allowMultiSelection: boolean;
  // public hostUrl: string = UrlServices.portalUrl();
  public hostUrl: string = '';
  //public hostUrl: string = 'https://ej2-aspcore-service.azurewebsites.net/';
  public args: FileSelectEventArgs;
  nzModalRef: NzModalRef;
  selectFiles = [];

  constructor(injector: Injector) {
    super(injector);
    this.nzModalRef = injector.get(NzModalRef);
  }

  public ngOnInit(): void {
    this.ajaxSettings = {
      url: this.hostUrl + '/api/portal/file-manager/fileoperations',
      getImageUrl: this.hostUrl + '/api/portal/file-manager/getimage',
      uploadUrl: this.hostUrl + '/api/portal/file-manager/upload',
      downloadUrl: this.hostUrl + '/api/portal/file-manager/download',
    };
    this.allowMultiSelection = false;
  }

  // File Manager's file select event function
  public onFileSelect(args: any) {
    if (args.fileDetails.isFile === true) {
      let url = '/Files/Portal' + args.fileDetails.filterPath.replaceAll('\\', '/') + args.fileDetails.name;
      if (args.action === 'select') {
        this.selectFiles.push({
          order: this.selectFiles.length + 1,
          path: url,
        });
      } else if (args.action === 'unselect') {
        let index = this.selectFiles.findIndex((x) => x.path === url);
        this.selectFiles.splice(index, 1);
      }
    }
  }

  onFileOpen(args: any): void {
    if (args.fileDetails.isFile === true) {
      let url = '/Files/Portal' + args.fileDetails.filterPath.replaceAll('\\', '/') + args.fileDetails.name;
      this.fileSelect.emit(url);
      this.nzModalRef.close(url);
    }
  }

  save() {
    if (this.selectFiles?.length > 0) {
      this.fileSelect.emit(this.selectFiles[0].path);
      this.nzModalRef.close(this.selectFiles[0].path);
    }
  }
}
