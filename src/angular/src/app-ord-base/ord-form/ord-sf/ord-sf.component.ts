import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { combineLatest, Subject } from '@node_modules/rxjs';
import { SubscriptionService } from '@node_modules/@abp/ng.core';
import { debounceTime, tap } from '@node_modules/rxjs/internal/operators';
import { DynamicFormPageComponent, OrdFormItem } from '../dynamic-form/dynamic-form-page.component';
import { IOrdFormSchema } from '../dynamic-form/ord-form-item-base';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';

@Component({
  selector: 'ord-sf',
  templateUrl: './ord-sf.component.html',
  styleUrls: ['./ord-sf.component.scss'],
  providers: [
    SubscriptionService
  ]
})
export class OrdSfComponent implements OnInit {
  @ViewChild('vcForm') vcForm: DynamicFormPageComponent;
  @Input() schema: IOrdFormSchema;
  @Input() tranformValue$: Subject<any> = new Subject();
  data: any = {};
  formItems: OrdFormItem[];
  show = false;
  changeDynamicForm$ = new Subject<any>();

  constructor(private subscription: SubscriptionService) {
  }

  ngOnInit(): void {
    this.setSchemaIntoDynamicForm();
    this.initSubscription();
  }

  setSchemaIntoDynamicForm() {
    if (this.schema) {
      this.formItems = [];
      this.data = {};
      Object.keys(this.schema).forEach((key) => {
        const valueOfKey = this.schema[key];
        if (AppUtilityService.isNullOrEmpty(valueOfKey.valueSubject)) {
          valueOfKey.valueSubject = new Subject<any>();
        }
        this.data[key] = valueOfKey.value;
        const form = valueOfKey.formDef;
        form.dataField = key;
        form.initDataValue = valueOfKey?.initValue;
        this.formItems = [...this.formItems, form];
      });
      this.show = true;
    }
  }

  onChangeData() {
    this.changeDynamicForm$.next(this.data);
  }

  private initSubscription() {
    this.subscription.addOne(this.changeDynamicForm$.pipe(debounceTime(500)), (data) => {
      Object.keys(this.schema).forEach((key) => {
        const valueOfKey = this.schema[key];
        valueOfKey.value = data[key];
      });
    });
    let lstSub = [];
    Object.keys(this.schema).forEach((key) => {
      const valueOfKey = this.schema[key];
      if (valueOfKey?.valueSubject) {
        lstSub = [...lstSub, valueOfKey.valueSubject.pipe(tap((v) => {
          this.setValue(key, v);
        }))];
      }
    }
    );
    this.subscription.addOne(combineLatest(lstSub).pipe(debounceTime(500)));
    if (this.tranformValue$) {
      this.subscription.addOne(this.tranformValue$.pipe(debounceTime(300)), (data) => {
        console.log(data, 'changeDataSubject');
        Object.keys(this.schema).forEach((key) => {
          const v = data[key];
          this.setValue(key, v);
        });
      });
    }
  }

  private setValue(key: string, v) {
    if (this.schema[key]) {
      this.schema[key].value = v;
    }
    this.data[key] = v;
  }

  submit(isValidate = true) {
    if (isValidate === true && this.vcForm.getDataForm() === null) {
      return null;
    } else {
      const data: any = {};
      Object.keys(this.schema).forEach((key) => {
        data[key] = this.data[key];
      });
      return data;
    }

  }
}
