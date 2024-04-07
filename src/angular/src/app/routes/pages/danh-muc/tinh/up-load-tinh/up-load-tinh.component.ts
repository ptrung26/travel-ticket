import { Component, Injector, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CheckValidImportExcelDanhMucTinhDto,
  CheckValidImportExcelDanhMucTinhRequest,
  DanhMucTinhServiceProxy,
} from '@service-proxies/danh-muc-service-proxies';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'up-load-tinh',
  templateUrl: './up-load-tinh.component.html',
  styleUrls: ['./up-load-tinh.component.css'],
})
export class UpLoadTinhComponent extends ModalComponentBase implements OnInit {
  @Input() dataInput: any[] = [];
  rfDataModal: FormGroup;
  header: string[] = [];

  constructor(injector: Injector, private dataService: DanhMucTinhServiceProxy, private fb: FormBuilder) {
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
            id: [(item[1] + '').trim(), [Validators.required]],
            ma: [(item[2] + '').trim(), [Validators.required]],
            ten: [(item[3] + '').trim(), [Validators.required]],
            cap: [(item[4] + '').trim(), [Validators.required]],
            strTinhGan: [(item[5] + '').trim()],
            strPhanVung: [(item[6] + '').trim()],
            tenEn: [],
            isTinhGan: [],
            phanVung: [],
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
    ora.ui.setBusy();
    const data: any[] = this.datas.value;
    const input = new CheckValidImportExcelDanhMucTinhRequest();
    input.input = data.map((item) => {
      const res = new CheckValidImportExcelDanhMucTinhDto();
      res.id = item.id;
      res.ten = item.ten;
      res.ma = item.ma;
      res.cap = item.cap;
      res.strTinhGan = item.strTinhGan;
      res.strPhanVung = item.strPhanVung;
      res.tenEn = item.tenEn;
      res.isValid = item.isValid;
      res.listError = item.ListError;
      return res;
    });

    this.dataService
      .checkValidImportExcelDanhMucTinh(input)
      .pipe(finalize(ora.ui.clearBusy))
      .subscribe((result) => {
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
      ora.ui.setBusy();
      if (this.rfDataModal.value?.listData?.some((x) => x.isValid == false)) {
        ora.notify.success('Vui lòng xóa bản ghi không hợp lệ');
        return;
      }

      this.dataService
        .uploadExcelDanhMucTinh(this.rfDataModal.value)
        .pipe(finalize(ora.ui.clearBusy))
        .subscribe((res) => {
          ora.notify.success('Xử lý thành công');
        });
    }
  }

  removeItem(item) {
    this.datas.removeAt(item);
  }
}
