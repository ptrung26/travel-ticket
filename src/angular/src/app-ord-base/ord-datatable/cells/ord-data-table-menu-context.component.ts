import { Component, Input, OnInit } from '@angular/core';
import { OrdActionColumn } from '@app-ord-base/ord-datatable/ord-column.component';
import * as $ from 'jquery';

@Component({
  selector: 'ord-datatable-menu-context',
  template: `
      <ul nz-menu nzSelectable class="ul-menu-context">
          <ng-container *ngFor="let act of actions; trackBy: trackByFn">
              <li nz-menu-item (click)="onClickMenuItem(record, act.callBack)" class="li-menu-context">
                    <span [ngClass]="act.nzIcon === 'delete' ? ' text-danger' : ''">
                         <span class="icon-menu-context">
                         <i nz-icon *ngIf="act.nzIcon" [nzType]="act.nzIcon" nzTheme="outline"></i>
                            <i *ngIf="act.icon" class="{{ act.icon }}"></i>
                            <img *ngIf="act.img" src="assets/images/thao-tac-icon/{{act.img}}" [width]="act.imgWidth" alt="{{act.name}}">
                    </span>
                    <span>
                        {{ act.name }}
                    </span>
                  </span>

              </li>
          </ng-container>
      </ul>
  `,
  styles: [
      `.ul-menu-context {
          background-color: #f9f9f9 !important;
          border: 1px solid #14d3ec;
          padding: 0;
      }

      .li-menu-context:hover {
          background-color: #d6dce2;
      }

      .icon-menu-context {
          min-width: 26px !important;
          max-width: 26px !important;
          display: inline-block;
      }
    `
  ]
})
export class OrdDataTableMenuContextComponent implements OnInit {
  @Input() actions: OrdActionColumn[];
  @Input() record: any;

  constructor() {
  }

  ngOnInit(): void {

  }

  onClickMenuItem(record, callBackFunc) {
    callBackFunc(record);
    $('.ant-dropdown').hide();
  }

  trackByFn(index: number, item: any) {
    if (item && item.id) {
      return item.id;
    }
    return index;
  }
}
