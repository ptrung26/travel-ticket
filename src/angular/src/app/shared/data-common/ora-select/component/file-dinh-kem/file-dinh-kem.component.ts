import { Component, EventEmitter, forwardRef, Injector, Input, OnInit, Output } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { AppConsts } from '@shared/AppConsts';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComboBoxComponentBase } from '@app/routes/form-builder/_subs/combo-box/base-combo-box.component';

@Component({
  selector: 'ord-file-dinh-kem',
  templateUrl: './file-dinh-kem.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OraFileDinhKemComponent),
    multi: true
  }]
})
export class OraFileDinhKemComponent extends ComboBoxComponentBase implements OnInit, ControlValueAccessor {
  @Input() textBtn: string = "Upload File";
  @Input() isViewChiTiet: boolean = true;
  @Input() filePath: any = null;
  @Output() filePathChange = new EventEmitter();
  @Input() fileBytes: any = null;
  @Output() fileBytesChange = new EventEmitter();
  constructor(
    injector: Injector,
    private _httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {

  }
  fileToUpload: File = null;
  //noimageDefault = AppConsts.appBaseUrl + '/assets/common/images/noimage2.png';
  noimageDefault = '';
  progress: number;
  message: string;


  uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    //let fileToUpload = <File>getArrFile[0];
    let fileToUpload = <File>files[0];

    // if (fileToUpload.size > 5242880) { //5MB
    //   ora.notify.error("File upload không được quá 5M");
    //   return;
    // }

    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this._httpClient.post(AppConsts.remoteServiceBaseUrl + '/File/Upload', formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          let dataRes = event.body;
          if (dataRes != null) {
            this.onFinished(dataRes);
          }
        }
      });
  }

  onFinished(item) {
    let data = item.result;
    this.fileBytes = data.fileBytes;
    this.filePath = data.filePath;
    this.filePathChange.emit(data.filePath); // two way binding
    this.fileBytesChange.emit(data.fileBytes); // two way binding
  }

  removeFile(filePath) {
    this.filePath = null;
    this.fileBytes = null;
    let url = AppConsts.remoteServiceBaseUrl + '/File/DeleteFile?fileName=' + filePath;
    this._httpClient.get(url).subscribe((response) => {
      if (response) {

      }
    });
  }

  getTypeFile(item) {
    let checkFileType = item.fileName.split('.').pop();
    var fileType;
    if (checkFileType == "txt") {
      fileType = "text/plain";
    }
    if (checkFileType == "pdf") {
      fileType = "application/pdf";
    }
    if (checkFileType == "doc" || checkFileType == "docx") {
      fileType = "application/vnd.ms-word";
    }
    if (checkFileType == "xls" || checkFileType == "xlsx") {
      fileType = "application/vnd.ms-excel";
    }
    if (checkFileType == "png") {
      fileType = "image/png";
    }
    if (checkFileType == "jpg" || checkFileType == "jpeg") {
      fileType = "image/jpeg";
    }
    if (checkFileType == "gif") {
      fileType = "image/gif";
    }
    if (checkFileType == "csv") {
      fileType = "text/csv";
    }
    return fileType;
  }
}
