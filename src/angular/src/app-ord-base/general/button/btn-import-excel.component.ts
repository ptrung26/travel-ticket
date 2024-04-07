import { Component, Input } from '@angular/core';

@Component({
  selector: 'btn-import-excel',
  template: `
    <button class="btn btn-outline-secondary margin-left-5" [routerLink]="[url]">
      <i nz-icon nzType="cloud-upload" nzTheme="outline"></i>
      <span class="margin-left-5">Nhập excel</span>
    </button>`
})
export class BtnImportExcelComponent {
  @Input() url = '';
}
