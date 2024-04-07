import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from '@node_modules/rxjs';
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
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import * as _ from 'lodash';
import { DanhMucQuocTichServiceProxy, QuocTichDto, QuocTichDtoCommonResultDto } from '@service-proxies/danh-muc-service-proxies';

@Component({
  templateUrl: './create-or-edit.component.html',
})
export class CreateOrEditQuocTichComponent extends ModalComponentBase implements OnInit, OnDestroy {
  @Input() dataItem: QuocTichDto;
  rfDataModal: FormGroup;
  saving = false;
  formSubmit$ = new Subject<any>();
  $destroy = new Subject<boolean>();

  get cruService(): Observable<QuocTichDtoCommonResultDto> {
    const fValue = this.rfDataModal.value;
    return this.dataItem ? this._dataService.update(this.dataItem.id, fValue) : this._dataService.create(fValue);
  }
  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }

  constructor(injector: Injector, private _dataService: DanhMucQuocTichServiceProxy, private fb: FormBuilder) {
    super(injector);
  }

  ngOnInit(): void {
    this.rfDataModal = this.fb.group({
      id: [{ value: '', disabled: !_.isEmpty(this.dataItem) }, [Validators.required], this.QuocTichIdExistValidator.bind(this)],
      ten: ['', [Validators.required]],
      tenEn: ['', [Validators.required]],
      alpha2Code: ['', Validators.compose([Validators.required, this.ExactlyTwoCharacterValidater()])],
      alpha3Code: ['', Validators.compose([Validators.required, this.ExactlyThreeCharacterValidater()])],
    });
    if (this.dataItem) {
      this.rfDataModal.patchValue(this.dataItem);
    }

    this.formSubmit$
      .pipe(
        tap(() => {
          if (this.rfDataModal.pending || this.rfDataModal.invalid) {
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
          ora.notify.success(this.dataItem ? this.l('EditSuccess') : this.l('CreateSuccess'));
          this.success(result.dataResult);
        });
    }
  }

  QuocTichIdExistValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return control.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      first(),
      switchMap((id) => {
        const updateId = _.isEmpty(this.dataItem) ? '' : this.dataItem.id;

        return this._dataService.isIdQuocTichExist(id, updateId).pipe(
          map<boolean, ValidationErrors>((res) => {
            if (res) {
              return { IsQuocTichIdExist: true };
            } else {
              return null;
            }
          }),
        );
      }),
    );
  }
  ExactlyTwoCharacterValidater(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let controlVal = control.value;
      let newVal = controlVal.replace(/\s+/g, '');
      return newVal.length === 2 ? null : { ExactlyTwoCharacter: true };
    };
  }
  ExactlyThreeCharacterValidater(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let controlVal = control.value;
      let newVal = controlVal.replace(/\s+/g, '');
      return newVal.length === 3 ? null : { ExactlyThreeCharacter: true };
    };
  }
}
