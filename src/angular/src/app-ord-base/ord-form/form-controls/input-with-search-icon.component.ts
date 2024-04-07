import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';

@Component({
  selector: 'input-with-search-icon',
  template: `
    <input
      (keyup.enter)="searchEvent.emit()"
      nz-input
      placeholder="{{ placeholder }}"
      [(ngModel)]="searchModel.filter"
      nzTooltipTitle="Ấn Enter để tìm kiếm"
      nzTooltipPlacement="bottomLeft"
      nz-tooltip
    />
    <!--      <nz-form-item (keyup.enter)="searchEvent.emit()">-->
    <!--          <nz-form-control nzFlex>-->
    <!--              <nz-input-group nzSearch [nzAddOnAfter]="suffixIconButton" style="width: 100%">-->
    <!--                  <input [(ngModel)]="searchModel.filter" type="text" nz-input-->
    <!--                         style="border-top-right-radius: 0;border-bottom-right-radius:0"-->
    <!--                         nzTooltipTitle="Ấn Enter để tìm kiếm" nzTooltipPlacement="bottomLeft" nz-tooltip-->
    <!--                         placeholder="{{placeholder}}"/>-->
    <!--              </nz-input-group>-->
    <!--              <ng-template #suffixIconButton>-->
    <!--                  <nz-button-group>-->
    <!--                      <button nz-button nzType="primary" title="Tìm kiếm" (click)="searchEvent.emit()"-->
    <!--                              style="border-radius: 0">-->
    <!--                          <i nz-icon nzType="search"></i>-->
    <!--                      </button>-->
    <!--                      <button nz-button nzType="default" (click)="resetSearchEvent.emit()" title="Làm mới">-->
    <!--                          <i nz-icon nzType="redo"></i>-->
    <!--                      </button>-->
    <!--                  </nz-button-group>-->
    <!--              </ng-template>-->
    <!--          </nz-form-control>-->
    <!--      </nz-form-item>-->
  `,
})
export class InputWithSearchIconComponent implements OnInit {
  @Input() placeholder = '';
  @Input() searchModel: any;
  @Output() searchEvent = new EventEmitter();
  @Output() resetSearchEvent = new EventEmitter();

  ngOnInit(): void {
    if (AppUtilityService.isNullOrEmpty(this.placeholder)) {
      this.placeholder = 'Nhập từ khóa.';
    } else {
      this.placeholder = 'Nhập ' + this.placeholder;
    }
  }
}
