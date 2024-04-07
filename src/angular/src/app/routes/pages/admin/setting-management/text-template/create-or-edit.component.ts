import { Component, Injector, Input, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { SettingManagementServiceProxy, TextTemplateDto } from '@service-proxies/tai-khoan-service-proxies';

@Component({
  templateUrl: './create-or-edit.component.html',
})
export class CreateOrEditTextTemplateComponent extends ModalComponentBase implements OnInit {
  @Input() dataItem: TextTemplateDto;
  rfDataModal: FormGroup;
  saving = false;

  constructor(injector: Injector, private _dataService: SettingManagementServiceProxy, private fb: FormBuilder) {
    super(injector);
  }

  ngOnInit(): void {
    this.rfDataModal = this.fb.group({
      content: ['', [Validators.required]],
    });
    if (this.dataItem) {
      this.rfDataModal.patchValue(this.dataItem);
    }
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
      this.dataItem.content = this.rfDataModal.value.content;
      this._dataService.updateTextTemplate(this.dataItem)
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
