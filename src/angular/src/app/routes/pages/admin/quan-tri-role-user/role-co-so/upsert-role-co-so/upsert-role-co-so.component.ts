import { Component, Injector, Input, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { SysRoleDto, SysRoleServiceProxy } from '@app/shared/service-proxies/tai-khoan-service-proxies';
import { finalize } from '@node_modules/rxjs/internal/operators';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { FormBuilder, FormGroup, Validators } from '@node_modules/@angular/forms';
import { ComboBoxDto, CommonServiceProxy } from '@service-proxies/danh-muc-service-proxies';
import { ComboBoxEnumCode } from '@app/shared/common/AppConsts';
import { uuid } from '@node_modules/@abp/ng.core';

@Component({
  templateUrl: './upsert-role-co-so.component.html',
  styleUrls: ['./upsert-role-co-so.component.scss'],
})
export class UpsertRoleCoSoComponent extends ModalComponentBase implements OnInit, AfterContentChecked {
  @Input() dataItem: SysRoleDto;
  rfFormGroup: FormGroup;
  levels: ComboBoxDto[];
  comboBoxEnumCode = ComboBoxEnumCode;

  constructor(
    injector: Injector,
    private cdref: ChangeDetectorRef,
    private _fb: FormBuilder,
    private _sysRoleService: SysRoleServiceProxy,
    private _commonService: CommonServiceProxy,
  ) {
    super(injector);
    this.rfFormGroup = this._fb.group({
      id: 0,
      roleId: uuid(),
      ma: ['', [Validators.required]],
      ten: ['', [Validators.required]],
      isStatic: false,
      isDefault: false,
      isActive: true,
      level: null,
      isSelected: false,
    });
  }

  ngOnInit(): void {
    this.getComboboxLevels();
    if (this.dataItem) {
      this.getById(this.dataItem.id);
    }
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getComboboxLevels() {
    // this._commonService.getappenum(this.comboBoxEnumCode.Level).subscribe(res => {
    //   this.levels = res;
    // });
  }

  getById(id: number) {
    ora.ui.setBusy();
    this._sysRoleService
      .getById(id)
      .pipe(
        finalize(() => {
          ora.ui.clearBusy();
        }),
      )
      .subscribe((dto) => {
        this.dataItem = dto;
        this.rfFormGroup.patchValue(this.dataItem);
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
      this._sysRoleService
        .upsertRoleCoSo(this.rfFormGroup.value)
        .pipe(
          finalize(() => {
            ora.ui.clearBusy();
          }),
        )
        .subscribe((res) => {
          if (res.isSuccessful) {
            ora.notify.success(this.dataItem?.id ? 'Chỉnh sửa vai trò thành công' : 'Tạo vai trò thành công');
            this.success(true);
          } else {
            ora.notify.error(res.errorMessage);
          }
        });
    }
  }
}
