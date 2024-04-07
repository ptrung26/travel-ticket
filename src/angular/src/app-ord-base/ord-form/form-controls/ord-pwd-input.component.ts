import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ord-pwd',
  template: `
    <nz-input-group nzPrefixIcon="lock" [nzSuffix]="suffixTemplate" style="display: flex; align-items: center; height: 32px">
      <input
        [type]="passwordVisible ? 'text' : 'password'"
        nz-input
        placeholder="{{ placeholder }}"
        [(ngModel)]="password"
        (ngModelChange)="passwordChange.emit($event)"
        [disabled]="sDisabled"
      />
    </nz-input-group>
    <ng-template #suffixTemplate>
      <i nz-icon [nzType]="passwordVisible ? 'eye-invisible' : 'eye'" (click)="passwordVisible = !passwordVisible"></i>
    </ng-template>
  `,
  styles: [
    `
      i {
        cursor: pointer;
      }

      input {
        border-top: 1px solid #d9d9d9  !important;
        border-bottom: 1px solid #d9d9d9 !important;
        border-radius: 0 !important;
      }

      input:hover {
        border-color: #78ad3b !important;
      }
    `,
  ],
})
export class OrdPwdInputComponent {
  @Input() placeholder = 'Nhập mật khẩu';
  @Input() password?: string;
  @Input() sDisabled?: boolean = false;
  @Output() passwordChange = new EventEmitter();
  passwordVisible = false;
}
