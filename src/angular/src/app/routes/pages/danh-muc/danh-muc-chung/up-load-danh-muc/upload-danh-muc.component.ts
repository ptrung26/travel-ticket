import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import * as XLSX from '@node_modules/xlsx';
import { finalize } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { ApiNameConfig, UrlServices } from '@service-proxies/service-url-config/url-services';
import {
  CheckValidImportExcelCodeSystemDto,
  CheckValidImportExcelCodeSystemRequest,
  CodeSystemServiceProxy,
  DownloadFTCodeSystemRequest,
  UploadExcelCodeSystemRequest,
} from '@app/shared/service-proxies/danh-muc-service-proxies';

@Component({
  selector: 'upload-danh-muc',
  templateUrl: './upload-danh-muc.component.html',
  styleUrls: ['./upload-danh-muc.component.scss'],
})
export class UploadDanhMucComponent extends ModalComponentBase implements OnInit {
  rfDataModal: FormGroup;
  saving = false;
  checking = false;
  fileControl = new FormControl();
  isUploading = false;
  listDataFromExcel = [];
  pageIndex = 1;
  pageSize = 10;
  fileName = '';
  disExport: boolean = true;
  displayText = '';
  disBtnKtra: boolean = true;
  code = '';
  disDownloadTemplate = true;
  listDataValid: CheckValidImportExcelCodeSystemDto[] = [];
  listDataInvalid: CheckValidImportExcelCodeSystemDto[] = [];
  constructor(injector: Injector, private _dataService: CodeSystemServiceProxy, private fb: FormBuilder) {
    super(injector);
  }

  ngOnInit(): void {
    this.rfDataModal = this.fb.group({
      parentCode: ['', [Validators.required]],
    });
  }

  selectedChange($event) {
    if ($event == undefined) {
      this.disExport = true;
      this.disDownloadTemplate = true;
    } else {
      this.disExport = false;
      this.displayText = $event.displayText;
      this.code = $event.value;
      this.disDownloadTemplate = false;
    }
  }

  pageChange(event) {
    this.pageIndex = event;
  }

  checkValidData() {
    if (this.rfDataModal.invalid) {
      ora.notify.error('Vui lòng kiểm tra lại thông tin!');
      // tslint:disable-next-line:forin
      for (const i in this.rfDataModal.controls) {
        this.rfDataModal.controls[i].markAsDirty();
        this.rfDataModal.controls[i].updateValueAndValidity();
      }
    } else {
      this.checking = true;
      const input = new CheckValidImportExcelCodeSystemRequest();
      input.parentCode = this.code;
      let rowData = [];
      input.input = [];
      this.listDataFromExcel.forEach((item, index) => {
        if (index > 1) {
          rowData = Object.values(item);
          const mapData = new CheckValidImportExcelCodeSystemDto();
          if (typeof rowData[0] === 'number') {
            mapData.code = rowData[0].toString();
          } else {
            mapData.code = rowData[0];
          }
          mapData.display = rowData[1];
          mapData.ngayTao = formatDate(Date.now(), 'yyyy-MM-dd', 'en-US');
          input.input.push(mapData);
        }
      });

      this._dataService
        .checkValidImportExcelDanhMucChung(input)
        .pipe(
          finalize(() => {
            this.checking = false;
          }),
        )
        .subscribe((result) => {
          this.pageIndex = 1;
          this.listDataValid = result.filter((x) => x.isValid === true);
          this.listDataInvalid = result.filter((x) => x.isValid === false);
        });
    }
  }

  clearFile() {
    this.listDataValid = [];
    this.listDataInvalid = [];
    this.fileName = '';
    this.disBtnKtra = true;
  }

  removeItem(type, index) {
    if (type === 0) {
      this.listDataInvalid.splice(index, 1);
    } else {
      this.listDataValid.splice(index, 1);
    }
  }

  save(): void {
    if (this.rfDataModal.invalid) {
      ora.notify.error('Vui lòng kiểm tra lại thông tin!');
      // tslint:disable-next-line:forin
      for (const i in this.rfDataModal.controls) {
        this.rfDataModal.controls[i].markAsDirty();
        this.rfDataModal.controls[i].updateValueAndValidity();
      }
    } else {
      this.saving = true;
      let input = new UploadExcelCodeSystemRequest();
      input.parentCode = this.rfDataModal.value.parentCode;
      input.listData = this.listDataValid;
      this._dataService.uploadExcelDanhMucChung(input).subscribe(() => {
        this.saving = false;
        ora.notify.success('Xử lý thành công');
        this.success(true);
      });
    }
  }

  onFileChange($event: any) {
    this.isUploading = true;
    this.listDataFromExcel = [];
    const formData = new FormData();
    const file = $event.target.files[0];
    this.fileName = file.name;
    formData.append('file', file);
    this.fileControl.patchValue('');
    const that = this;
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      const arrayBuffer: any = fileReader.result;
      let data = new Uint8Array(arrayBuffer);
      let arr = new Array();
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      let bstr = arr.join('');
      let workbook = XLSX.read(bstr, { type: 'binary' });

      const sheet_name = workbook.SheetNames[0];
      const dataJSON = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name], { header: 1, raw: true, defval: '' });
      let display = '';
      if (dataJSON.length > 0) {
        let header = dataJSON[0];
        if (header[0] == this.displayText) {
          if (dataJSON.length < 5002) {
            this.listDataFromExcel = dataJSON;
            this.disBtnKtra = false;
          } else {
            ora.notify.error('Tối đa 5000 dòng dữ liệu');
            this.disBtnKtra = true;
          }
        } else {
          ora.notify.error('File import không đúng định dạng của danh mục');
          this.disBtnKtra = true;
        }
      }

      this.isUploading = false;
    };
    fileReader.readAsArrayBuffer(file);
  }

  DownloadTemplateFile(display: string) {
    const input = new DownloadFTCodeSystemRequest();
    input.display = display;
    this._dataService
      .downloadFtcodeSystem(input)
      .pipe(finalize(() => ora.ui.clearBusy()))
      .subscribe((result) => {
        ora.downloadFile(UrlServices.danhMucUrl(), ApiNameConfig.danhMuc.apiName, result.fileToken);
      });
  }
}
