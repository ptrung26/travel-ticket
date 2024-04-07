import { Component, Injector, Input, OnInit } from '@angular/core';
import { Observable, Subject } from '@node_modules/rxjs';

import { filter, finalize, startWith, switchMap, take, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { validateNoSpace } from '@shared/customValidator/validate-no-space';
import {
  ConfigSystemDto,
  ConfigSystemDtoCommonResultDto,
  ConfigSystemServiceProxy,
} from '@app/shared/service-proxies/danh-muc-service-proxies';

@Component({
  templateUrl: './create-or-edit.component.html',
})
export class CreateOrEditCauHinhChungComponent extends ModalComponentBase implements OnInit {
  @Input() dataItem: ConfigSystemDto;
  rfDataModal: FormGroup;
  saving = false;
  formSubmit$ = new Subject<any>();

  // formatter = (value: number) => '${value.replace(/\\B(?=(\\d{3})+(?!\\d))/g, \'.\')} ';

  get cruService(): Observable<ConfigSystemDtoCommonResultDto> {
    const fValue = this.rfDataModal.value;
    return this.dataItem ? this._dataService.update(this.dataItem.id, fValue) : this._dataService.create(fValue);
  }

  constructor(injector: Injector, private _dataService: ConfigSystemServiceProxy, private fb: FormBuilder) {
    super(injector);
  }

  ngOnInit(): void {
    this.rfDataModal = this.fb.group({
      type: [1],
      ma: ['', [Validators.required, validateNoSpace]],
      giaTri: ['', [Validators.required, validateNoSpace]],
      moTa: ['', [Validators.required, validateNoSpace]],
      tuNgay: ['', [Validators.required]],
      denNgay: [''],
    });
    if (this.dataItem) {
      this.rfDataModal.patchValue(this.dataItem);
    }
    this.formSubmit$
      .pipe(
        tap(() => {
          if (this.rfDataModal.pending) {
            // tslint:disable-next-line:forin
            for (const i in this.rfDataModal.controls) {
              this.rfDataModal.controls[i].markAsDirty();
              this.rfDataModal.controls[i].updateValueAndValidity();
            }
          }
        }),
        switchMap(() =>
          this.rfDataModal.statusChanges.pipe(
            startWith(this.rfDataModal.status),
            filter((status) => status !== 'PENDING'),
            take(1),
          ),
        ),
      )
      .subscribe((validation) => {
        if (validation === 'VALID') {
          this.save();
        } else {
          ora.notify.error('Vui lòng kiểm tra lại thông tin!');
        }
      });
  }

  save(): void {
    if (this.rfDataModal.invalid) {
      ora.notify.error('Vui lòng xem lại thông tin form');
      // tslint:disable-next-line:forin
      for (const i in this.rfDataModal.controls) {
        this.rfDataModal.controls[i].markAsDirty();
        this.rfDataModal.controls[i].updateValueAndValidity();
      }
    } else {
      this.saving = true;
      this.cruService
        .pipe(
          finalize(() => {
            this.saving = false;
          }),
        )
        .subscribe((result) => {
          ora.notify.info(this.dataItem ? 'Chỉnh sửa dữ liệu thành công!' : 'Thêm mới dữ liệu thành công!');
          this.success(true);
        });
    }
  }
}
