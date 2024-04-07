import { Component, Injector, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Subject } from '@node_modules/rxjs';
import { DanhMucTinhServiceProxy, PHAN_VUNG_TINH, TinhDto, TinhDtoCommonResultDto } from '@service-proxies/danh-muc-service-proxies';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import * as _ from 'lodash';
import { debounceTime, distinctUntilChanged, filter, finalize, first, map, startWith, switchMap, take, tap } from 'rxjs/operators';

@Component({
  templateUrl: './create-or-edit.component.html',
})
export class CreateOrEditTinhComponent extends ModalComponentBase implements OnInit {
  @Input() dataItem: TinhDto;
  rfDataModal: FormGroup;
  saving = false;
  formSubmit$ = new Subject<any>();
  listPhanVung = [
    {
      value: PHAN_VUNG_TINH.TAY_NGUYEN,
      displayText: 'Tây Nguyên',
    },
    {
      value: PHAN_VUNG_TINH.DUYEN_HAI_MIEN_TRUNG,
      displayText: 'Duyên Hải miền Trung',
    },
    {
      value: PHAN_VUNG_TINH.DONG_NAM_BO,
      displayText: 'Đông Nam Bộ',
    },
    {
      value: PHAN_VUNG_TINH.KHAC,
      displayText: 'Khác',
    },
  ];

  get cruService(): Observable<TinhDtoCommonResultDto> {
    const fValue = this.rfDataModal.value;
    return this.dataItem ? this._dataService.update(this.dataItem.id, fValue) : this._dataService.create(fValue);
  }

  constructor(injector: Injector, private _dataService: DanhMucTinhServiceProxy, private fb: FormBuilder) {
    super(injector);
  }

  ngOnInit(): void {
    this.rfDataModal = this.fb.group({
      id: ['', [Validators.required], this.TinhIdExistValidator.bind(this)],
      ma: ['', [Validators.required], this.MaTinhExistValidator.bind(this)],
      ten: ['', [Validators.required]],
      cap: [''],
      isTinhGan: [],
      phanVung: [],
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
    // const dto = this.vcForm.onSubmit();
    if (this.rfDataModal.invalid) {
      ora.notify.error('Vui lòng kiểm tra lại thông tin!');
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
          ora.notify.success(this.dataItem ? 'Chỉnh sửa dữ liệu thành công!' : 'Thêm mới dữ liệu thành công!');
          this.success(true);
        });
    }
  }

  TinhIdExistValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return control.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      first(),
      switchMap((id) => {
        const updateId = _.isEmpty(this.dataItem) ? '' : this.dataItem.id;
        return this._dataService.isIdTinhExist(id, updateId).pipe(
          map<boolean, ValidationErrors>((res) => {
            if (res) {
              return { IsTinhIdExist: true };
            } else {
              return null;
            }
          }),
        );
      }),
    );
  }

  MaTinhExistValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return control.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      first(),
      switchMap((ma) => {
        const updateMa = _.isEmpty(this.dataItem) ? '' : this.dataItem.ma;
        return this._dataService.isMaTinhExist(ma, updateMa).pipe(
          map<boolean, ValidationErrors>((res) => {
            if (res) {
              return { IsMaExist: true };
            } else {
              return null;
            }
          }),
        );
      }),
    );
  }
}
