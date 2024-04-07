import { Component, Input, OnInit } from '@angular/core';
import { NzSelectModeType } from '@node_modules/ng-zorro-antd/select';
import { SubscriptionService } from '@node_modules/@abp/ng.core';
import { OrdFormItem } from '../../dynamic-form/dynamic-form-page.component';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';

export interface IOrdSelectOpt {
  nzMode?: NzSelectModeType;
  nzShowSearch?: true;
  nzMaxTagCount?: number;
  nzAllowClear?: boolean;
  data?: {
    label: string;
    value: string;
  }[];
}

@Component({
  selector: 'ord-base-control-select',
  template: `
    <nz-select
      [nzSize]="control.size"
      [style.padding]="control?.padding"
      [style.fontSize]="control?.fontSize"
      [(ngModel)]="dataForm[control.dataField]"
      (ngModelChange)="onChangeSelectControlForm($event)"
      [nzMode]="nzMode"
      [nzMaxTagCount]="nzMaxTagCount"
      [nzShowSearch]="nzShowSearch"
      [nzAllowClear]="nzAllowClear"
      [nzDisabled]="control.disabled"
      [nzPlaceHolder]="control.placeholder"
      style="width: 100%"
    >
      <nz-option *ngFor="let op of listOfOptions" [nzValue]="op.value" [nzLabel]="op.label"> </nz-option>
    </nz-select>
  `,
  providers: [SubscriptionService],
})
export class SelectControlComponent implements OnInit {
  @Input() dataForm = {};
  @Input() control: OrdFormItem;
  @Input() allControls: OrdFormItem[] = [];
  nzMode: NzSelectModeType = 'default';
  nzMaxTagCount = 1;
  listOfOptions: any[] = [];
  nzShowSearch = true;
  nzAllowClear = true;

  constructor(private subscription: SubscriptionService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.nzShowSearch = this.control?.showSearch;
      this.listOfOptions = this.control?.option?.data;
      if (this.control?.option?.isMultiSelect === true) {
        this.nzMode = 'multiple';
      }
      this.setOptionFromSelectOpt();
      this.getOptionsFromAsyncData();
    });
  }

  setOptionFromSelectOpt() {
    const opt = this.control?.option?.selectOpt;
    if (opt) {
      this.nzMode = opt.nzMode;
      if (opt.data) {
        this.listOfOptions = opt.data;
      }
      if (opt?.nzMaxTagCount) {
        this.nzMaxTagCount = opt.nzMaxTagCount;
      }
      this.nzShowSearch = opt.nzShowSearch;
      if (AppUtilityService.isNotNull(opt?.nzAllowClear)) {
        this.nzAllowClear = opt.nzAllowClear;
      }
    }
  }

  getOptionsFromAsyncData() {
    const opt = this.control.option;
    if (opt && opt.asyncData) {
      this.subscription.addOne(opt.asyncData, (data: any[]) => {
        this.listOfOptions = data;
      });
    }
  }

  onChangeFormItem() {
    if (this.control.handlerOnChange) {
      this.control.handlerOnChange(this.dataForm, this.allControls);
    }
  }

  onChangeSelectControlForm(value) {
    this.onChangeFormItem();
    if (this.control?.option?.data) {
      if (this.control?.formControlChangeSubject) {
        // tslint:disable-next-line:triple-equals
        const f = this.control.option.data.find((x) => x.value == value);
        this.control.formControlChangeSubject.next(f);
      }
    }
  }
}
