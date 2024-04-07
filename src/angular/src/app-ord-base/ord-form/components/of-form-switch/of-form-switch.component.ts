import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { OrdFormItem } from '../../dynamic-form/dynamic-form-page.component';

@Component({
  selector: 'of-form-switch',
  templateUrl: './of-form-switch.component.html'
})
export class OfFormSwitchComponent implements OnChanges {
  @Input() control: OrdFormItem;
  @Input() dataForm: OrdFormItem;
  @Input() valueOfControl = null;
  @Input() listOfFormItems: OrdFormItem[] = [];
  @Output() searchEvent = new EventEmitter();
  @Output() resetSearchEvent = new EventEmitter();
  @Input() urlUploadFile = '';
  @Input() dynamicFormItemTemplate: TemplateRef<any>;
  @Input() submitted = false;
  @Input() keyControlElementId = Number(new Date());

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.valueOfControl) {
      this.convertNumberToString(changes.valueOfControl.currentValue);
    }
  }

  // chuyển số sang string để select nhận giá trị
  convertNumberToString(value) {
    if (typeof value === 'number') {
      this.dataForm[this.control.dataField] = '' + this.dataForm[this.control.dataField];
    }
  }
}
