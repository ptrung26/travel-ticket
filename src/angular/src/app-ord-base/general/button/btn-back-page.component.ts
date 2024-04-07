import { Component, Input } from '@angular/core';

@Component({
  selector: 'btn-back-page',
  template: `
    <a [routerLink]="[url]" class="btn btn-secondary mr-2" [nzTooltipTitle]="tooltip"
       nzTooltipPlacement="bottomRight" nz-tooltip>
      <i nz-icon nzType="backward" nzTheme="outline" class="margin-right-5"></i>
      <span class="hidden-mobile">Quay lại</span>
    </a>`
})
export class BtnBackPageComponent {
  @Input() url = '';
  @Input() tooltip = '';
}
