import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from '@node_modules/rxjs';
import { XaDtoCommonResultDto, DanhMucXaServiceProxy, XaDto } from '@service-proxies/danh-muc-service-proxies';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  first,
  map,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { ISelectOption } from '@shared/data-common/ora-select/model';
import * as _ from 'lodash';

@Component({
  templateUrl: './create-or-edit.component.html',
})
export class CreateOrEditXaComponent extends ModalComponentBase implements OnInit, OnDestroy {
  @Input() dataItem: XaDto;
  rfDataModal: FormGroup;
  saving = false;
  formSubmit$ = new Subject<any>();
  $destroy = new Subject<boolean>();

  get cruService(): Observable<XaDtoCommonResultDto> {
    const fValue = this.rfDataModal.value;
    return this.dataItem ? this._dataService.update(this.dataItem.id, fValue) : this._dataService.create(fValue);
  }

  constructor(injector: Injector, private _dataService: DanhMucXaServiceProxy, private fb: FormBuilder) {
    super(injector);
  }
  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }

  ngOnInit(): void {
    this.rfDataModal = this.fb.group({
      id: ['', [Validators.required], this.XaIdExistValidator.bind(this)],
      ten: ['', [Validators.required]],
      huyenId: ['', [Validators.required]],
      tinhId: ['', [Validators.required]],
      cap: [''],
    });

    // reload huyen select when tinhId change
    // this.rfDataModal.controls['tinhId'].valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((tinhId) => {
    //   let huyenIdctr = this.rfDataModal.controls['huyenId'];
    //   let validators = huyenIdctr.validator;
    //   let asyncCalidators = huyenIdctr.asyncValidator;
    //   huyenIdctr.clearValidators();
    //   huyenIdctr.clearAsyncValidators();
    //   this.rfDataModal.controls['huyenId'].reset();
    //   huyenIdctr.setValidators(validators);
    //   huyenIdctr.setAsyncValidators(asyncCalidators);
    // });

    if (this.dataItem?.id) {
      this.rfDataModal.patchValue(this.dataItem);
    }

    this.formSubmit$
      .pipe(
        tap(() => {
          // console.log(this.rfDataModal.value);
          // tslint:disable-next-line:forin
          for (const i in this.rfDataModal.controls) {
            this.rfDataModal.controls[i].markAsDirty();
            this.rfDataModal.controls[i].updateValueAndValidity();
          }
        }),
        switchMap(() =>
          this.rfDataModal.statusChanges.pipe(
            startWith(this.rfDataModal.status),
            filter((status) => status !== 'PENDING'),
            take(1),
          ),
        ),
        takeUntil(this.$destroy),
      )

      .subscribe((validation) => {
        if (validation === 'VALID') {
          this.save();
        } else {
          ora.notify.error(this.l('Error_CheckForm'));
        }
      });
  }

  save(): void {
    if (this.rfDataModal.invalid) {
      ora.notify.error(this.l('Error_CheckForm'));
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
          // ora.notify.info(this.l('SavedSuccessfully'));
          // console.log('saving result: ', result);
          if (result.isSuccessful) {
            ora.notify.success(this.dataItem ? this.l('EditSuccess') : this.l('CreateSuccess'));
            this.success(result.dataResult);
          } else {
            ora.notify.error(result.errorMessage);
          }
        });
    }
  }

  onTinhSelected($event: ISelectOption) {
    this.rfDataModal.get('tenTinh').patchValue($event?.displayText);
  }

  XaIdExistValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return control.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      first(),
      switchMap((id) => {
        const updateId = _.isEmpty(this.dataItem) ? '' : this.dataItem.id;

        return this._dataService.isIdXaExist(id, updateId).pipe(
          map<boolean, ValidationErrors>((res) => {
            if (res) {
              return { IsXaIdExist: true };
            } else {
              return null;
            }
          }),
        );
      }),
    );
  }
}
