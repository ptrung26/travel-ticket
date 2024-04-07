import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import {
  OrdFormItem
} from './dynamic-form-page.component';

@Component({
  selector: 'ord-combo-extension',
  template: `
         <ng-container [ngSwitch]="control.option.typeCombo">
            <ng-container *ngSwitchCase="'don-vi-co-so'">
                  <don-vi-co-so-search-combo name="donvicoso" ngDefaultControl [disabled]="control.disabled" [(ngModel)]="dataForm[control.dataField]"
                            [isXNKhangDinh]="control.option.isXNKhangDinh" [isXNSangLoc]="control.option.isXNSangLoc" [isDieuTri]="control.option.isDieuTri"
                            (changeDV)="onChangeSelectControlForm($event)">
                  </don-vi-co-so-search-combo>
            </ng-container>
         </ng-container>
    `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OrdComboExtensionComponent),
    multi: true
  }]
})

export class OrdComboExtensionComponent {
  @Input() dataForm = {};
  @Input() control: OrdFormItem;
  @Input() allControls: OrdFormItem[] = [];
  @Input() type: string = "";
  constructor() {}

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
