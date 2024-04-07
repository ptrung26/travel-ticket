import { Component, OnInit, Injector, ViewEncapsulation, Input } from '@angular/core';
import { finalize } from 'rxjs/operators';
import {
  ComboBoxDto,
  OrganizationunitsServiceProxy,
  SysOrganizationunitsDto,
} from '@app/shared/service-proxies/tai-khoan-service-proxies';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { validSDT } from '@shared/customValidator/validSDT';
import { uuid } from '@node_modules/@abp/ng.core';

@Component({
  selector: 'app-create-or-update-modal',
  templateUrl: './create-or-update-modal.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CreateOrUpdateOrganizationUnitsModalComponent extends ModalComponentBase implements OnInit {
  @Input() dataItem: SysOrganizationunitsDto;

  rfFormGroup: FormGroup;
  allSysOrganizationunits: ComboBoxDto[] = [];

  constructor(
    injector: Injector,
    private _fb: FormBuilder,
    private _organizationunitsServiceProxy: OrganizationunitsServiceProxy,
  ) {
    super(injector);
    this.rfFormGroup = this._fb.group({
      id: 0,
      organizationunitsId: uuid(),
      pId: null,
      maPhongBan: ['', [Validators.required]],
      tenPhongBan: ['', [Validators.required]],
      tenPhongBanKhongDau: [''],
      email: ['', [Validators.email]],
      soDienThoai: ['', [validSDT]],
      fax: [''],
      loaiPhongBan: null,
    });
  }

  ngOnInit(): void {
    this.getAllSysOrganizationunits();
    if (this.dataItem?.id) {
      this.getById(this.dataItem.id);
    }
  }

  getAllSysOrganizationunits() {
    ora.ui.setBusy();
    this._organizationunitsServiceProxy.getallorganizationunits().pipe(finalize(() => {
      ora.ui.clearBusy();
    })).subscribe(res => {
      this.allSysOrganizationunits = res;
    });
  }

  getById(id: number) {
    ora.ui.setBusy();
    this._organizationunitsServiceProxy
      .organizationunitById(id)
      .pipe(finalize(ora.ui.clearBusy))
      .subscribe((res) => {
        if (res.isSuccessful) {
          this.dataItem = res.dataResult;
          this.rfFormGroup.patchValue(this.dataItem);
        }
      });
  }

  save() {
    if (this.rfFormGroup.invalid) {
      ora.notify.error(this.l('Error_CheckForm'));
      for (const i in this.rfFormGroup.controls) {
        this.rfFormGroup.controls[i].markAsDirty();
        this.rfFormGroup.controls[i].updateValueAndValidity();
      }
    } else {
      ora.ui.setBusy();
      this._organizationunitsServiceProxy
        .createOrUpdate(this.rfFormGroup.value)
        .pipe(finalize(() => {ora.ui.clearBusy()}))
        .subscribe((res) => {
          if (res.isSuccessful) {
            ora.notify.success(this.dataItem?.id ? 'Chỉnh sửa phòng ban thành công' : 'Thêm phòng ban thành công');
            this.success(true);
          } else {
            ora.notify.error(res.errorMessage);
          }
        });
    }
  }
}
