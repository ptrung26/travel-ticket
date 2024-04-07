import { Component, Injector, Input, OnInit } from '@angular/core';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';

import {
  DanhMucXaServiceProxy,
  CheckValidImportExcelXaDto,
  CheckValidImportExcelXaRequest,
} from '@service-proxies/danh-muc-service-proxies';

@Component({
  selector: 'app-up-load-xa-modal',
  templateUrl: './up-load-xa-modal.component.html',
  styleUrls: ['./up-load-xa-modal.component.css'],
})
export class UpLoadXaModalComponent extends ModalComponentBase implements OnInit {
  @Input() dataInput: any[] = [];
  rfDataModal: FormGroup;
  header: string[] = [];
  totalCurrentError = 0;

  constructor(injector: Injector, private dataService: DanhMucXaServiceProxy, private fb: FormBuilder) {
    super(injector);
  }

  ngOnInit() {
    this.rfDataModal = this.fb.group({
      listData: this.fb.array([], (abs: AbstractControl) => {
        const v: any[] = abs.value;
        const itemFind = v.find((x) => x.isValid === false);
        if (itemFind) {
          return {
            notValidData: true,
          };
        }
      }),
    });
    this.header = this.dataInput[0];
    this.initFormArray();
  }

  get datas(): FormArray {
    return this.rfDataModal.get('listData') as FormArray;
  }

  initFormArray() {
    const controls = this.datas;
    this.dataInput.forEach((item, index) => {
      if (index > 0) {
        controls.push(
          this.fb.group({
            tinhId: [item[0], [Validators.required]],
            huyenId: [item[1], [Validators.required]],
            id: [item[2], [Validators.required, this.NoWhitespaceValidator()]],
            ten: [item[3], [Validators.required, this.NoWhitespaceValidator()]],
            cap: [item[4]],
            isActive: [item[5]],
            isValid: true,
            listError: [[]],
          }),
        );
      }
    });
    this.checkValidData();
  }

  checkValidData() {
    const data: any[] = this.datas.value;
    const input = new CheckValidImportExcelXaRequest();
    input.input = data.map((item) => {
      const res = new CheckValidImportExcelXaDto();
      res.tinhId = item.tinhId;
      res.huyenId = item.huyenId;
      res.id = item.id;
      res.ten = item.ten;
      res.cap = item.cap;
      res.isActive = item.isActive;
      res.isValid = item.isValid;
      res.listError = item.ListError;

      return res;
    });
    // console.log('inp :', input);
    this.dataService.checkValidImportExcelNhomThucPham(input).subscribe((result) => {
      console.log('valid res: ', result);
      // check mã dinh dưỡng đã có ở các row trước !
      let passedValue = new Map();
      this.totalCurrentError = 0;
      this.datas.controls.forEach((contr, index) => {
        let curItem = result[index];
        let preRow = passedValue.get(curItem.id) + 1;
        if (preRow) {
          curItem.listError.push('Mã xã trùng với dòng ' + preRow);
          curItem.isValid = false;
        } else {
          passedValue.set(curItem.id, index);
        }
        contr.setValue(curItem);
        if (!curItem.isValid) {
          this.totalCurrentError += 1;
        }
      });
    });
  }

  save() {
    if (this.rfDataModal.invalid) {
      // ora.notify.error('Vui lòng xem lại thông tin đã nhập!');
      // tslint:disable-next-line:forin
      for (const i in this.rfDataModal.controls) {
        this.rfDataModal.controls[i].markAsDirty();
        this.rfDataModal.controls[i].updateValueAndValidity();
      }
      // tslint:disable-next-line:forin
      for (const i in this.datas.controls) {
        const fGr: any = this.datas.controls[i];
        // tslint:disable-next-line:forin
        for (const j in fGr.controls) {
          fGr.controls[j].markAsDirty();
          fGr.controls[j].updateValueAndValidity();
        }
      }
    } else {
      // console.log(this.rfDataModal.value);
      this.dataService.uploadExcelXa(this.rfDataModal.value).subscribe(() => {
        ora.notify.success('Xử lý thành công');
        this.success(true);
      });
    }
  }
  xoaBanGhi(index: number) {
    if (this.datas.controls[index].value['isValid'] === false) {
      this.totalCurrentError -= 1;
    }
    this.datas.removeAt(index);
  }
  NoWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let controlVal = control.value;
      if (typeof controlVal === 'number') {
        controlVal = `${controlVal}`;
      }
      let isWhitespace = (controlVal || '').trim().length === 0;
      let isValid = !isWhitespace;
      return isValid ? null : { whitespace: 'value is only whitespace' };
    };
  }
}
