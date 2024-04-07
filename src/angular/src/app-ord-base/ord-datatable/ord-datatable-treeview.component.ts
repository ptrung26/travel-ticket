import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { OrdActionColumn } from './ord-column.component';
import { nzTableHelper } from '../shared/nzTableHelper';

import { PagedResultDto, RestService } from '@abp/ng.core';
import * as _ from 'lodash';
import { AppUtilityService } from '../services/app-utility.service';
import { finalize } from 'rxjs/operators';
import { OrdColumnTreeViewComponent } from './ord-column-treeview.component';
import { ActionCellStateService } from './cells/action-cell-state.service';

@Component({
  selector: 'ord-datatable-treeview',
  templateUrl: './ord-datatable-treeview.component.html',
  providers: [ActionCellStateService]
})
export class DatatableTreeViewComponent implements OnInit {
  @Input() searchDto;
  @Input() actions: OrdActionColumn[];
  @Input() scrollX: number;
  @Input() scrollY: number;
  @Input() pageSize = 10;
  @Input() apiName = '';
  @Input() baseApiUrl = '';
  @Input() bordered = true;
  @Input() paging = true;
  @Output() searchDataChangeEvent = new EventEmitter();
  recordSelectedIdx = -1;
  @Output()
  recordSelectedChangeEvent = new EventEmitter();
  @Output()
  dbClickRowEvent = new EventEmitter();
  tblScroll: any = null;
  columns: OrdColumnTreeViewComponent[] = [];
  nzTable: nzTableHelper = new nzTableHelper();

  // hiện btn lựa chọn cột
  @Input() showBtnSelectColums = false;
  columnsToDisplay: number[] = [];
  arrActionsIsAnyItem = false;
  lstmain: any[] = [];
  lstTreeData: any[] = [];

  constructor(injector: Injector,
    public actionCellStateService: ActionCellStateService,
    private restService: RestService) {

  }

  ngOnInit(): void {
    this.nzTable.pageSize = this.pageSize;
    this.setTblScroll();
    // this.getGridDataSource();
    this.arrActionsIsAnyItem = AppUtilityService.isNotAnyItem(this.actions) === false;
    this.actionCellStateService.setAction(this.actions);
  }

  setTblScroll() {
    if (AppUtilityService.isNullOrEmpty(this.scrollX) === false) {
      if (this.tblScroll === null) {
        this.tblScroll = {};
      }
      this.tblScroll.x = this.scrollX + 'px';
    }
    if (AppUtilityService.isNullOrEmpty(this.scrollY) === false) {
      if (this.tblScroll === null) {
        this.tblScroll = {};
      }
      this.tblScroll.y = this.scrollY + 'px';
    }
  }

  addColumn(column) {
    this.columns.push(column);
  }

  trackByFn(index: number, item: any) {
    if (item && item.id) {
      return item.id;
    }
    return index;
  }

  search(searchObj) {
    this.searchDto = _.cloneDeep(searchObj);
    this.nzTable.pageIndex = 1;
    this.getGridDataSource();
  }

  getGridDataSource() {
    // const params: any = {
    //   ...this.searchDto,
    //   skipCount: this.nzTable.getSkipCount(),
    //   maxResultCount: this.nzTable.getMaxResultCount()
    // };
    const params: any = {
      ...this.searchDto,
      skipCount: 0,
      maxResultCount: 999
    };
    this.searchDto = _.cloneDeep(params);
    this.recordSelectedIdx = -1;
    this.nzTable.loading = true;
    this.restService.request<any, PagedResultDto<any>>({
      method: 'POST',
      url: '/api/' + this.baseApiUrl + '/getlist',
      body: params
    },
      { apiName: this.apiName })
      .pipe(finalize(() => {
        this.nzTable.loading = false;
      }))
      .subscribe(data => {
        this.setDataTable(data);
        this.searchDataChangeEvent.emit(params);
      });
  }

  setDataTable(data) {
    if (this.nzTable.pageIndex > 1) {
      if (AppUtilityService.isNotAnyItem(this.nzTable.items)) {
        this.nzTable.pageIndex = this.nzTable.pageIndex - 1;
        this.getGridDataSource();
        return;
      }
    }
    this.processData(data.items);
    // this.buildTreeData(data.items);
    this.nzTable.items = this.lstmain;
    this.nzTable.totalCount = this.lstmain.length;
    // this.nzTable.items = data.items;
    // this.nzTable.totalCount = data.totalCount;

  }

  onClickRow(event, idx) {
    this.recordSelectedIdx = idx;
    this.recordSelectedChangeEvent.emit(event);
  }

  expandChange(event, id) {
    if (event == true) {
      this.lstmain.filter(x => x.id != id).forEach(x => {
        x.expand = false;
      });
    }
  }

  pressUpDownKeyChangeSelectRow(event) {
    // if (this.recordSelectedIdx === -1) {
    //   return;
    // }
    // if (event.keyCode === 38) {
    //   if (this.recordSelectedIdx === 0) {
    //     return;
    //   }
    //   this.onClickRow(this.recordSelectedIdx - 1);
    // }
    // if (event.keyCode === 40) {
    //   if (this.recordSelectedIdx === this.nzTable.items.length - 1) {
    //     return;
    //   }
    //   this.onClickRow(this.recordSelectedIdx + 1);
    // }
  }

  checkDisplayColumn(idx: number) {
    if (this.showBtnSelectColums === true) {
      return this.columnsToDisplay.indexOf(idx) > -1;
    }
    return true;
  }

  buildTreeData(data: any[]) {

    this.lstmain = data.filter(x => x.parentId == null || x.parentId == '');
    // add child no papa
    data.filter(x => x.parentId != null || x.parentId != '').forEach(x => {
      if (!data.find(p => p.id == x.parentId) && !this.lstmain.find(m => x.id == m.id)) {
        this.lstmain.push(x);
      }
    });

    this.lstTreeData = [];
    this.lstmain.forEach((x, idx) => {
      x.expand = true;
      x.hasChild = false;
      this.lstTreeData[idx] = [];
      this.lstTreeData[idx].push(x);
      let lstChild = data.filter(y => y.parentId == x.id);
      if (lstChild.length > 0) {
        x.hasChild = true;
        lstChild.forEach(x2 => {
          // x2.expand = false;
          // x2.hasChild = false;
          x2.parentName = x.ten;
          this.lstTreeData[idx].push(x2);
        });
      }
      ;
    });

  }

  processData(data: any[]) {
    let final: any[];
    // findParentWhenFilterByTextSearch
    if (this.searchDto.filter != null && this.searchDto.filter != '') {
      let lstchild = data.filter(x => {
        return this.compareFullText(x.ten, this.searchDto.filter) || this.compareFullText(x.ma, this.searchDto.filter);
      });
      final = _.cloneDeep(lstchild);
      lstchild.filter(x => x.parentId != null).forEach(x => {
        let item = data.find(y => y.id == x.parentId);
        if (!final.find(x => x.id == item.id)) {
          final.push(item);
        }
      });
    } else {
      final = data;
    }

    this.buildTreeData(final);
  }

  compareFullText(s1: string, s2: string) {
    s1 = AppUtilityService.getFullTextSearch(s1);
    s2 = AppUtilityService.getFullTextSearch(s2);
    return s1.indexOf(s2) > -1;
  }
}
