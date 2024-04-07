import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { AppUtilityService } from './app-utility.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ReadFileExcelService {
  private dataOfExcelSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dataOfExcel$ = this.dataOfExcelSubject.asObservable();

  constructor() {
  }

  protected arrayBuffer: any;

  clearExcelData() {
    this.dataOfExcelSubject.next([]);
  }

  readDataSheet(file: File, sheetIdx = 0) {
    ora.ui.setBusy();
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      let data = new Uint8Array(this.arrayBuffer);
      let arr = new Array();
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      let bstr = arr.join('');
      let workbook = XLSX.read(bstr, { type: 'binary' });
      this.loadDataSheet(workbook, sheetIdx);
    };
    fileReader.readAsArrayBuffer(file);
  }

  protected loadDataSheet(workbook, sheetIdx: number) {
    this.clearExcelData();
    let sheet_name = workbook.SheetNames[sheetIdx];
    let worksheet = workbook.Sheets[sheet_name];
    const lstData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true });
    //ora.ui.clearBusy();
    this.dataOfExcelSubject.next(lstData);
    ora.event.trigger('event-ReadFileExcelService-loadDataSheet', lstData);
  }

  parseKetQuaKhamExcel(listOfDataExcel: any[]) {
    let isBeginGetHeader = false;
    let lstHeader: any[] = [];
    let listOfKetQua: any[] = [];
    _.forEach(listOfDataExcel, (it, idx) => {
      if (AppUtilityService.isNullOrEmpty(it[0])) {
        if (isBeginGetHeader === true) {
          lstHeader = Object.assign(lstHeader, it);
          return;
        }
      }
      if (this.checkIsSTTRow(it[0])) {
        lstHeader = Object.assign([], it);
        isBeginGetHeader = true;
      }
      if (isNaN(it[0]) === false) {
        isBeginGetHeader = false;
        listOfKetQua.push(
          _.map(it, (d) => {
            if (d) {
              return '' + d;
            }
            return d;
          })
        );
      }
    });
    return {
      listOfHeader: lstHeader,
      listOfKetQua: listOfKetQua
    };
  }

  protected checkIsSTTRow(d) {
    let stt = '' + d;
    stt = stt.toLowerCase();
    return stt === 'stt';
  }
}
