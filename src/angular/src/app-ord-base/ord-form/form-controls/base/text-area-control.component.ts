import { Component, Input, OnInit } from '@angular/core';
import { OrdFormItem } from '../../dynamic-form/dynamic-form-page.component';

@Component({
  selector: 'ord-base-control-text-area',
  template: `
    <textarea
      nz-input
      [nzSize]="control.size"
      [style.padding]="control?.padding"
      [style.fontSize]="control?.fontSize"
      class="ord-dynamic-input"
      [(ngModel)]="dataForm[control.dataField]"
      (ngModelChange)="onChangeFormItem()"
      [disabled]="control.disabled"
      [placeholder]="control.placeholder"
      [nzAutosize]="{ minRows: rows, maxRows: 20 }"
      rows="{{ rows }}"
      maxlength="{{ control.maxlength }}"
    ></textarea>
  `,
})
export class TextAreaControlComponent implements OnInit {
  @Input() dataForm = {};
  @Input() control: OrdFormItem;
  @Input() allControls: OrdFormItem[] = [];
  rows = 1;

  ngOnInit(): void {
    this.rows = this.control?.option?.rowsTextArea || 1;
  }

  onChangeFormItem() {
    if (this.control.handlerOnChange) {
      this.control.handlerOnChange(this.dataForm, this.allControls);
    }
  }
}
