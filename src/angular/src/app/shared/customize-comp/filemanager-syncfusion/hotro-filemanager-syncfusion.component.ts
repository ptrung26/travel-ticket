import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { UrlServices } from '@app/shared/service-proxies/service-url-config/url-services';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { FileSelectEventArgs } from '@syncfusion/ej2-angular-filemanager';
import { NzModalRef } from 'ng-zorro-antd/modal';
@Component({
  selector: 'hotro-file-manager',
  templateUrl: './hotro-filemanager-syncfusion.component.html',
})
export class HotroFilemanagerSyncfusionComponent extends ModalComponentBase implements OnInit {
  @Output() fileSelect = new EventEmitter();
  public ajaxSettings: object;
  public allowMultiSelection: boolean;
  public hostUrl: '';
  //public hostUrl: string = 'https://ej2-aspcore-service.azurewebsites.net/';
  public args: FileSelectEventArgs;
  nzModalRef: NzModalRef;
  constructor(injector: Injector) {
    super(injector);
    this.nzModalRef = injector.get(NzModalRef);
  }
  public ngOnInit(): void {
    this.ajaxSettings = {
      url: this.hostUrl + '/api/ho-tro/file-manager/fileoperations',
      getImageUrl: this.hostUrl + '/api/ho-tro/file-manager/getimage',
      uploadUrl: this.hostUrl + '/api/ho-tro/file-manager/upload',
      downloadUrl: this.hostUrl + '/api/ho-tro/file-manager/download',
    };
    this.allowMultiSelection = false;
  }
  // File Manager's file select event function
  public onFileSelect(args: any) {
    if (args.fileDetails.isFile === true) {
      let url = '/Files' + args.fileDetails.filterPath.replaceAll('\\', '/') + args.fileDetails.name;

      //let result = '{"fileName": "' + args.fileDetails.name + '", "fileUrl": "' + url + '"}';

      this.fileSelect.emit(url);
      this.nzModalRef.close(url);
    }
  }
}
