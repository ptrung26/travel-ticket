import { Component, Injector, Input, OnInit, ɵclearResolutionOfComponentResourcesQueue } from '@angular/core';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';

import {
  DanhMucQuocTichServiceProxy,
  CheckValidImportExcelQuocTichDto,
  CheckValidImportExcelQuocTichRequest,
} from '@service-proxies/danh-muc-service-proxies';

@Component({
  templateUrl: './up-load-modal.component.html',
  styleUrls: ['./up-load-modal.component.css'],
})
export class UpLoadQuocTichModalComponent extends ModalComponentBase implements OnInit {
  @Input() dataInput: any[] = [];
  rfDataModal: FormGroup;
  header: string[] = [];
  totalCurrentError = 0;

  constructor(injector: Injector, private dataService: DanhMucQuocTichServiceProxy, private fb: FormBuilder) {
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
            stt: item[0],
            id: [item[1], [Validators.required]],
            ten: [item[2], [Validators.required]],
            tenEn: [item[3], [Validators.required]],
            alpha2Code: [item[4], [Validators.required]],
            alpha3Code: [item[5], [Validators.required]],
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
    const input = new CheckValidImportExcelQuocTichRequest();
    input.input = data.map((item) => {
      const res = new CheckValidImportExcelQuocTichDto();
      res.stt = item.stt;
      res.id = item.id;
      res.ten = item.ten;
      res.tenEn = item.tenEn;
      res.alpha2Code = item.alpha2Code;
      res.alpha3Code = item.alpha3Code;
      res.isValid = item.isValid;
      res.listError = item.ListError;

      return res;
    });

    this.dataService.checkValidImportExcelQuocTich(input).subscribe((result) => {
      // check mã quốc gia đã có ở các row trước !
      let passedValue = new Map();
      this.totalCurrentError = 0;
      this.datas.controls.forEach((contr, index) => {
        let curItem = result[index];
        let preRow = passedValue.get(curItem.id) + 1;
        if (preRow) {
          curItem.listError.push('Mã quốc gia trùng với dòng ' + preRow);
          curItem.isValid = false;
        } else {
          passedValue.set(curItem.id, index);
        }
        contr.setValue(result[index]);
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
      this.dataService.uploadExcelQuocTich(this.rfDataModal.value).subscribe(() => {
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
}
