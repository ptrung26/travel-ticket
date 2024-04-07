import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'btn-upload-file',
  template: `
    <button class="margin-right-40 btn btn-sm btn-outline-success" (click)="clickChonFileBtn()">
      <i class="fa fa-file-import margin-right-5"></i>Chọn file
    </button>
    <input #excelFileInput type="file" id="{{idInputFile}}"
           (change)="incomingfile($event)" class="kt-margin-r-10"
           placeholder="Upload file" accept=".xlsx,.xls"
           hidden="hidden"
    >
    <label class="font-weight-bolder">Tên file đã chọn:
      <span class="text-danger kt-margin-l-30"
            style="background: yellow;">{{tenFile}}</span>
    </label>
  `
})
export class BtnUploadFileComponent implements OnInit {
  @Input() listOfLoaiFile: any[] = ['xlsx', 'xls'];
  idInputFile = '';

  @Input() tenFile = 'Chưa chọn file';
  @Output() tenFileChange = new EventEmitter();

  @Input() fileHopLe = false;
  @Output() fileHopLeChange = new EventEmitter();

  @Input() file: File;
  @Output() fileChange = new EventEmitter();

  @Output() selectFileSuccessEvent = new EventEmitter();

  constructor() {
    this.idInputFile = 'inputFileMauKetQuaExcel_' + Number(new Date());
  }

  ngOnInit(): void {

  }

  clickChonFileBtn() {
    $('#' + this.idInputFile).click();
  }

  incomingfile(event) {
    const file = event.target.files[0];
    if (file && this.checkTenFile(file)) {
      this.fileHopLe = true;
      this.fileHopLeChange.emit(true);
      this.file = file;
      this.fileChange.emit(file);
      this.tenFile = file.name;
      this.tenFileChange.emit(file.name);
      this.selectFileSuccessEvent.emit(file);
      return;
    }

    ora.notify.error('File không hợp lệ! Vui lòng chọn lại file khác');
    //this.toaster.error('File không hợp lệ! Vui lòng chọn lại file khác');
  }

  checkTenFile(file) {
    const filename = file.name;
    const fileExt = filename.split('.').pop();
    return this.listOfLoaiFile.indexOf(fileExt) > -1;
  }

  reset() {
    this.fileHopLe = false;
    this.fileHopLeChange.emit(false);
    this.file = null;
    this.fileChange.emit(null);
    this.tenFile = 'Chưa chọn file';
    this.tenFileChange.emit('Chưa chọn file');
  }
}
