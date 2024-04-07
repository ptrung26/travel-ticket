import { Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from '@node_modules/rxjs';
import { AppComponentBase } from '@shared/common/AppComponentBase';
import * as _ from 'lodash';
import { nzTableHelper } from '../shared/nzTableHelper';

@Component({
  selector: 'base-table-edit',
  templateUrl: './base-table-edit.component.html',
  styleUrls: ['./base-table-edit.component.scss']
})
export class BaseTableEditComponent extends AppComponentBase implements OnInit, OnDestroy {
  @Output() onSelectedItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCheckedItem: EventEmitter<any> = new EventEmitter<any>();

  get data() {
    return this.nzTable.items;
  }

  @Input()
  set datasource(values: any[]) {
    if (values && values.length > 0) {
      this.nzTable.items = [];
      this.nzTable.items = [...this.nzTable.items, ...values];
      this.nzTable.pageIndex = 1;
      this.nzTable.totalCount = values.length;
      this.listOfCurrentPageData = this.nzTable.items;
      this.listDataSelected = [];

      const listDataChecked = this.listOfCurrentPageData.filter((item) => {
        return item.isSelected === true;
      });
      if (listDataChecked?.length > 0) {
        this.listDataSelected = listDataChecked;
      }
    } else {
      this.nzTable.items = [];
      this.nzTable.totalCount = 0;
    }
  }

  @Input()
  set totalCount(value: number) {
    this.nzTable.totalCount = value;
  }

  get totalCount() {
    return this.nzTable.totalCount;
  }
  nzTable: nzTableHelper = new nzTableHelper();
  $destroy = new Subject<boolean>();
  model: any;

  isTableLoading = false;
  pageSize = 0;
  skipCount = 0;
  tableScroll = {};

  checked = false;
  loading = false;
  indeterminate = false;
  listOfData: readonly any[] = [];
  listOfCurrentPageData: readonly any[] = [];
  listDataSelected: any[] = [];
  setOfCheckedId = new Set<number>();

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }

  ngOnInit(): void {
  }

  updateCheckedSet(id: number, checked: boolean): void {
    const dataSelected = this.listOfCurrentPageData.find((item) => {
      return item.id === id;
    });

    if (checked) {
      this.setOfCheckedId.add(id);
      if (dataSelected) {
        this.listDataSelected.push(dataSelected);
      }
    } else {
      this.setOfCheckedId.delete(id);
      this.listDataSelected = _.filter(this.listDataSelected, (item: any) => {
        return item.id !== id;
      });
    }

    this.onCheckedItem.emit(this.listDataSelected);
  }

  onCurrentPageDataChange(listOfCurrentPageData: readonly any[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData
      .filter(({ disabled }) => !disabled)
      .forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  updateValue(value: any) {
    const itemInfo = value.id > -1 ? this.nzTable.items[value.id] : this.nzTable.items.find((item: any) => {
      return item.id === value.id;
    });

    if (itemInfo) {
      Object.assign(itemInfo, value);
    }

    this.onSelectedItem.emit(this.nzTable.items);
  }

  reloadData(data) {
    this.search(true, data);
  }

  private search(resetPage: boolean = true, data: any[]) {
    this.nzTable.loading = true;
    this.nzTable.shouldResetPaging(resetPage);
    if (data) {
      this.nzTable.items = [...data];
      this.nzTable.totalCount = data.length;
      this.onSelectedItem.emit(this.nzTable.items);
      this.listOfCurrentPageData = data;
      this.onSelectedItem.emit(this.listOfCurrentPageData);
    }
  }
}



