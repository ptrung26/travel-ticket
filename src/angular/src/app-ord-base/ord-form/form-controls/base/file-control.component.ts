import { Component, Input, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { v4 as uuid } from 'uuid';
import { OrdFormItem } from '../../dynamic-form/dynamic-form-page.component';

@Component({
  selector: 'ord-base-control-file',
  template: `
    <nz-upload [(nzFileList)]="fileList" [nzAction]="urlUploadFile + '/' + Guid" [nzBeforeUpload]="beforeUpload">
      <button [nzSize]="control.size" [style.padding]="control?.padding" [style.fontSize]="control?.fontSize" nz-button><i nz-icon nzType="upload"></i>Click to Upload</button>
    </nz-upload>
  `,
})
export class FileControlComponent implements OnInit {
  @Input() dataForm = {};
  @Input() control: OrdFormItem;
  @Input() allControls: OrdFormItem[] = [];
  @Input() urlUploadFile: string;
  Guid = uuid();
  fileList: NzUploadFile[] = [];
  ngOnInit(): void { }
  beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]) => {
    this.dataForm[this.control.dataField] = this.Guid;
    this.Guid = uuid();
    return;
  };
}
