import { Component, Injector, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CheckValidImportExcelDanhMucHuyenDto,
  CheckValidImportExcelDanhMucHuyenRequest,
  DanhMucHuyenServiceProxy,
} from '@service-proxies/danh-muc-service-proxies';
import { ModalComponentBase } from '@shared/common/modal-component-base';

@Component({
  selector: 'up-load-huyen',
  templateUrl: './up-load-huyen.component.html',
  styleUrls: ['./up-load-huyen.component.scss'],
})
export class UpLoadHuyenComponent extends ModalComponentBase implements OnInit {
  @Input() dataInput: any[] = [];
  rfDataModal: FormGroup;
  header: string[] = [];

  constructor(injector: Injector, private dataService: DanhMucHuyenServiceProxy, private fb: FormBuilder) {
    super(injector);
  }

  ngOnInit(): void {
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
            id: [item[1], [Validators.required]],
            ten: [item[2], [Validators.required]],
            tenTinh: [item[3], [Validators.required]],
            cap: [item[4], [Validators.required]],
            tinhId: [],
            tenEn: [],
            isValid: [true],
            listError: [],
            isActive: true,
          }),
        );
      }
    });
    this.checkValidData();
  }

  checkValidData() {
    const data: any[] = this.datas.value;
    const input = new CheckValidImportExcelDanhMucHuyenRequest();
    input.input = data.map((item) => {
      const res = new CheckValidImportExcelDanhMucHuyenDto();
      res.id = item.id;
      res.ten = item.ten;
      res.tinhId = item.tinhId;
      res.tenTinh = item.tenTinh;
      res.cap = item.cap;
      res.tenEn = item.tenEn;
      res.isValid = item.isValid;
      res.listError = item.ListError;
      return res;
    });
    this.dataService.checkValidImportExcelDanhMucHuyen(input).subscribe((result) => {
      this.datas.controls.forEach((contr, index) => {
        contr.setValue(result[index]);
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
      this.dataService.uploadExcelDanhMucHuyen(this.rfDataModal.value).subscribe(() => {
        ora.notify.success('Xử lý thành công');
        this.success(true);
      });
    }
  }

  removeItem(item) {
    this.datas.removeAt(item);
  }
}
