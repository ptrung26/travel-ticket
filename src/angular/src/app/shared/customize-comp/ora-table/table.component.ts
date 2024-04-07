import {Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList} from '@angular/core';
import {coerceBooleanProperty} from '@node_modules/@angular/cdk/coercion';
import {NzSafeAny} from '@node_modules/ng-zorro-antd/core/types';
import {Subject} from '@node_modules/rxjs';
import {OraColumnDirective} from './directives/ora-column.directive';
import {Dictionary} from './models/types';

@Component({
  selector: 'ora-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class OraTableComponent implements OnInit {
  private _rows: Dictionary[] = [];
  @Input() set rows(v: Dictionary[]) {
    this._rows = v ? v : [];
    this.refreshCheckStatus(this.rows);
  }

  get rows() {
    return this._rows;
  }

  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() totalRows = 0;
  @Input() isLoading = false;
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50, 100, 200];
  @Input() paginationPosition = 'bottom';

  _hiddenHeader = false;
  @Input()
  get hiddenHeader() {
    return this._hiddenHeader;
  }

  set hiddenHeader(value: boolean) {
    this._hiddenHeader = coerceBooleanProperty(value);
  }

  @Input() scroll: {
    x?: string | null;
    y?: string | null;
  };

  @Input()
  get paginationSimple() {
    return this._paginationSimple;
  }

  set paginationSimple(value: boolean) {
    this._paginationSimple = coerceBooleanProperty(value);
  }

  private _paginationSimple = false;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<{
    key: NzSafeAny;
    value: string | null;
  }>();

  @ContentChildren(OraColumnDirective) columns!: QueryList<OraColumnDirective>;

  @Input() selectedDataItems: Dictionary[] = [];
  @Input() bordered = true;

  @Output() selectedDataItemsChange = new EventEmitter<Dictionary[]>();
  allChecked = false;
  checkboxIndeterminate = false;
  allCheckboxDisabled = false;

  @Output() onDataItemSelected = new EventEmitter<any>();
  @Input() indexSelected: number;
  @Output() indexSelectedChange = new EventEmitter<number>();

  $destroy = new Subject<boolean>();
  @Input() frontPagination = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  onPageNumberChange($event: number) {
    this.indexSelected = undefined;
    this.pageChange.emit($event);
  }

  onPageSizeChange($event: number) {
    this.indexSelected = undefined;
    this.pageSizeChange.emit($event);
  }

  onSort($event: { key: NzSafeAny; value: string | null }) {
    this.indexSelected = undefined;
    this.sortChange.emit($event);
  }

  checkAll(value: boolean): void {
    const listFilter = this.rows.filter(({disabled}) => !disabled);
    listFilter.forEach((data) => ((<Dictionary>data).checked = this.allChecked));
    this.refreshCheckStatus(listFilter);
  }

  refreshCheckStatus(entityList: Dictionary[]): void {
    this.indexSelected = undefined;
    const listFilter = entityList.filter(({disabled}) => !disabled);
    if (listFilter.length === 0) {
      this.allChecked = false;
      this.checkboxIndeterminate = false;
      this.selectedDataItems = [];
      this.allCheckboxDisabled = true;
    } else {
      this.allCheckboxDisabled = false;
      // Chọn tất cả
      const allChecked = listFilter.every((value) => value.checked === true);
      // bỏ chọn tất cả
      const allUnChecked = listFilter.every((value) => !value.checked);
      this.allChecked = allChecked;
      // Kiểu hộp chọn
      this.checkboxIndeterminate = !allChecked && !allUnChecked;
      // Dữ liệu đã chọn
      this.selectedDataItems = listFilter.filter((value) => value.checked);
    }

    this.selectedDataItemsChange.emit(this.selectedDataItems);
  }

  restCheckStatus(entityList: Dictionary[]): void {
    this.allChecked = false;
    this.checkboxIndeterminate = false;
    // Dữ liệu đã chọn
    this.selectedDataItems = [];
    entityList.forEach((value) => (value.checked = false));
    this.selectedDataItemsChange.emit(this.selectedDataItems);
  }

  onRowClick(data: Dictionary, index: number) {
    this.indexSelected = index;
    this.indexSelectedChange.emit(index);
    this.onDataItemSelected.emit(data);
  }
}
