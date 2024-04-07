import { Component, Injector, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponentBase } from '@shared/common/AppComponentBase';
import { SettingManagementServiceProxy } from '@service-proxies/tai-khoan-service-proxies';
import { finalize } from '@node_modules/rxjs/internal/operators';

@Component({
  templateUrl: './setting-management.component.html',
  styleUrls: ['./setting-management.component.scss'],
})
export class SettingManagementComponent extends AppComponentBase implements OnInit {
  // @Input() dataItem: ConfigSystemDto;
  @Input() dataItem: any;
  rfDataModal: FormGroup;
  saving = false;

  constructor(injector: Injector, private _dataService: SettingManagementServiceProxy, private fb: FormBuilder) {
    super(injector);
  }

  ngOnInit(): void {
    this.rfDataModal = this.fb.group({
      defaultFromDisplayName: ['', [Validators.required]],
      defaultFromAddress: ['', [Validators.required, Validators.email]],
      smtpHost: ['smtp.gmail.com', [Validators.required]],
      smtpPort: ['587', [Validators.required]],
      smtpDomain: [''],
      smtpUserName: ['', [Validators.required]],
      smtpPassword: ['', [Validators.required]],
    });
    this._dataService
      .getSettingManagement()
      .pipe(finalize(() => {}))
      .subscribe((result) => {
        this.rfDataModal.patchValue(result);
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
      this._dataService
        .updateSettingManagement(this.rfDataModal.value)
        .pipe(
          finalize(() => {
            this.saving = false;
          }),
        )
        .subscribe((result) => {
          ora.notify.info('Chỉnh sửa dữ liệu thành công!');
        });
    }
  }
}
