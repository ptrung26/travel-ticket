import { Component, Injector, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateNoSpace } from '@app/shared/customValidator/validate-no-space';
import { CodeSystemDto, CodeSystemServiceProxy } from '@app/shared/service-proxies/danh-muc-service-proxies';
import { Subject } from '@node_modules/rxjs';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { filter, finalize, startWith, switchMap, take, tap } from 'rxjs/operators';

@Component({
  templateUrl: './create-or-edit.component.html',
})
export class CreateOrEditDanhMucComponent extends ModalComponentBase implements OnInit {
  @Input() dataItem: CodeSystemDto;
  @Input() dissable = false;
  rfDataModal: FormGroup;
  formSubmit$ = new Subject<any>();
  parentCodeCheck = '';
  isAddNewContinue = true;

  constructor(injector: Injector, private _dataService: CodeSystemServiceProxy, private fb: FormBuilder) {
    super(injector);
    this.rfDataModal = this.fb.group({
      code: ['', [Validators.required, validateNoSpace]],
      display: ['', [Validators.required, validateNoSpace]],
      parentId: [],
      parentCode: [''],
      id: [0],
    });
  }

  ngOnInit(): void {
    if (this.dataItem) {
      this.rfDataModal.patchValue(this.dataItem);
    }
    this.isAddNewContinue = !this.dataItem?.id;
    this.validateForm();
  }

  save(): void {
    if (this.rfDataModal.invalid) {
      ora.notify.error('Vui lòng xem lại thông tin form');
      for (const i in this.rfDataModal.controls) {
        this.rfDataModal.controls[i].markAsDirty();
        this.rfDataModal.controls[i].updateValueAndValidity();
      }
    } else {
      ora.ui.setBusy();
      this._dataService
        .codeSystemCreateOrUpdate(this.rfDataModal.value)
        .pipe(finalize(ora.ui.clearBusy))
        .subscribe((result) => {
          if (result.isSuccessful) {
            ora.notify.success(this.dataItem?.id > 0 ? 'Chỉnh sửa dữ liệu thành công!' : 'Thêm mới dữ liệu thành công!');
            if (this.isAddNewContinue) {
              const parentCode = this.rfDataModal.get('parentCode').value;
              this.dataItem = new CodeSystemDto();
              this.dataItem.init({
                parentCode: parentCode,
                id: 0,
              });
              this.rfDataModal.patchValue(this.dataItem);
              this.isMustReloadGrid = true;
              return;
            }
            this.success(true);
          } else {
            ora.notify.error(result.errorMessage);
            console.error(result.exceptionError);
          }
        });
    }
  }

  validateForm() {
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

  selectedChange($event) {
    if ($event != null && $event != undefined) {
      this.parentCodeCheck = $event.value;
    }
  }
}
