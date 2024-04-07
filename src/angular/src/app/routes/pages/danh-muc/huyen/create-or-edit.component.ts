import { Component, Injector, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Subject } from '@node_modules/rxjs';
import { DanhMucHuyenServiceProxy, HuyenDto, HuyenDtoCommonResultDto } from '@service-proxies/danh-muc-service-proxies';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import * as _ from 'lodash';
import { debounceTime, distinctUntilChanged, filter, finalize, first, map, startWith, switchMap, take, tap } from 'rxjs/operators';

@Component({
  templateUrl: './create-or-edit.component.html',
})
export class CreateOrEditHuyenComponent extends ModalComponentBase implements OnInit {
  @Input() dataItem: HuyenDto;
  rfDataModal: FormGroup;
  saving = false;
  formSubmit$ = new Subject<any>();

  get cruService(): Observable<HuyenDtoCommonResultDto> {
    const fValue = this.rfDataModal.value;
    return this.dataItem ? this._dataService.update(this.dataItem.id, fValue) : this._dataService.create(fValue);
  }

  constructor(injector: Injector, private _dataService: DanhMucHuyenServiceProxy, private fb: FormBuilder) {
    super(injector);
  }

  ngOnInit(): void {
    this.rfDataModal = this.fb.group({
      id: ['', [Validators.required], this.HuyenIdExistValidator.bind(this)],
      ten: ['', [Validators.required]],
      tinhId: ['', [Validators.required]],
      cap: [''],
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

  HuyenIdExistValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return control.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      first(),
      switchMap((id) => {
        const updateId = _.isEmpty(this.dataItem) ? '' : this.dataItem.id;
        return this._dataService.isIdHuyenExist(id, updateId).pipe(
          map<boolean, ValidationErrors>((res) => {
            if (res) {
              return { IsHuyenIdExist: true };
            } else {
              return null;
            }
          }),
        );
      }),
    );
  }
}
