import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';
import { OrdColumnComponent } from '../ord-column.component';

@Component({
  selector: 'app-btn-list-show-columns-config',
  templateUrl: './btn-list-show-columns-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BtnListShowColumnsConfigComponent implements OnInit {
  @Input() columns: OrdColumnComponent[] = [];
  @Output() columnsToDisplay = new EventEmitter();
  lstOfShowHideColumns: any[] = [];
  isShowAllCol = true;

  constructor() {
  }

  ngOnInit(): void {
    this.getListCheckBoxColumns();
  }

  getListCheckBoxColumns() {
    this.lstOfShowHideColumns = [];
    _.forEach(this.columns, (it, idx) => {
      this.lstOfShowHideColumns.push({
        value: idx,
        label: it.header,
        checked: true
      });
    });
    this.onChangeSelectColumnCheckboxGroup();
  }

  changeAllCheckBoxShow() {
    if (this.isShowAllCol === true) {
      this.lstOfShowHideColumns.forEach(it => {
        it.checked = true;
      });
    } else {
      this.lstOfShowHideColumns.forEach(it => {
        it.checked = false;
      });
    }
    this.onChangeSelectColumnCheckboxGroup();
  }

  onChangeSelectColumnCheckboxGroup() {
    const check = this.lstOfShowHideColumns.find(x => x.checked === false);
    this.isShowAllCol = AppUtilityService.isNullOrEmpty(check);
    const lst: number[] = [];
    this.lstOfShowHideColumns.forEach((it, idx) => {
      if (it.checked === true) {
        lst.push(idx);
      }
    });
    this.columnsToDisplay.emit(lst);
  }
}
