import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { OrdActionColumn, OrdColumnComponent } from './ord-column.component';
import { nzTableHelper } from '../shared/nzTableHelper';
import { PagedResultDto, RestService } from '@abp/ng.core';
import * as _ from 'lodash';
import { AppUtilityService } from '../services/app-utility.service';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';
import { OfSchemaModel } from '@node_modules/@orendaco/of';
import { DestroyRxjsService } from 'src/shared/destroy-rxjs.service';
import { ActionCellStateService } from './cells/action-cell-state.service';

@Component({
  selector: 'ord-datatable',
  templateUrl: './ord-datatable.component.html',
  providers: [ActionCellStateService, DestroyRxjsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatatableComponent implements OnInit, AfterViewInit {
  @Input() searchDto;
  @Input() actions: OrdActionColumn[];
  @Input() scrollX: number;
  @Input() scrollY: number;
  @Input() pageSize = 10;
  @Input() apiName = '';
  @Input() baseApiUrl = '';
  @Input() actionName = 'getlist';
  @Input() query = '';
  @Input() isFullUrlPatch = false;
  @Input() bordered = true;
  @Input() showPagination = true;
  @Input() customizeNotResult = false;
  @Output() searchDataChangeEvent = new EventEmitter();
  recordSelectedIdx = -1;
  @Output()
  recordSelectedChangeEvent = new EventEmitter();
  @Output()
  dbClickRowEvent = new EventEmitter();
  @Output() checkAllEvent = new EventEmitter();
  tblScroll: any = null;
  columns: OrdColumnComponent[] = [];
  nzTable: nzTableHelper = new nzTableHelper();
  // hiện btn lựa chọn cột
  @Input() showBtnSelectColums = false;
  columnsToDisplay: number[] = [];
  arrActionsIsAnyItem = false;
  @Input() isCheckAll = false;
  @Input() isResetCheckbox = false;
  @Input() arrCheckBox?: any = [];
  @Output() changeResetCheckbox = new EventEmitter();
  @Input() ordPaginationSize: 'default' | 'sm' | 'md' = 'default';
  @Input() searchSchemaModel: OfSchemaModel;
  @Input() isAddParamsToFilterSearchObj = false;

  constructor(
    injector: Injector,
    private restService: RestService,
    public actionCellStateService: ActionCellStateService,
    private cdref: ChangeDetectorRef,
    private destroy$: DestroyRxjsService,
  ) {}

  ngOnInit(): void {
    this.nzTable.pageSize = this.pageSize;
    this.setTblScroll();
    this.arrActionsIsAnyItem = AppUtilityService.isNotAnyItem(this.actions) === false;
    this.actionCellStateService.setAction(this.actions);
  }
  sortChange(key: string, value: string) {
    let sort = {
      key,
      value,
    };
    this.nzTable.getSort(sort);
    this.getGridDataSource();
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
    if (this.isAddParamsToFilterSearchObj === true) {
      this.searchDto = this.addParamsToFilterSearchObj(this.searchDto);
    }
    this.nzTable.pageIndex = 1;

    this.getGridDataSource();
  }

  /**
   * longnh: Add thêm params vào object filter
   * @param searchObj
   */
  private addParamsToFilterSearchObj(searchObj) {
    const filter = searchObj?.filter;
    if (filter) {
      for (let property in searchObj) {
        if (property != 'filter') {
          filter[property] = searchObj[property];
        }
      }
      searchObj.filter = filter;
    }
    return searchObj;
  }

  reload() {
    this.getGridDataSource();
  }

  getGridDataSource() {
    const params: any = {
      ...this.searchDto,
      skipCount: this.nzTable.getSkipCount(),
      maxResultCount: this.nzTable.getMaxResultCount(),
      sorting: this.nzTable.sorting,
    };
    if (this.showPagination === false) {
      params.maxResultCount = 999;
    }
    this.searchDto = _.cloneDeep(params);
    this.recordSelectedIdx = -1;
    // ora.ui.setBusy();
    this.nzTable.loading = true;
    let urlFetch = '/api/' + this.baseApiUrl + '/' + this.actionName;
    if (this.isFullUrlPatch === true) {
      urlFetch = this.baseApiUrl;
    }
    this.restService
      .request<any, PagedResultDto<any>>(
        {
          method: 'POST',
          url: urlFetch,
          body: params,
        },
        { apiName: this.apiName },
      )
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.nzTable.loading = false;
          });
        }),
      )
      .subscribe((data) => {
        this.nzTable.loading = false;
        this.setDataForTable(data);
        // console.log(data, 'data list');
        ora.event.trigger('dataOf/' + this.baseApiUrl, data);
        ora.event.trigger('dataOf/' + this.baseApiUrl + '/' + this.actionName, data);
        this.searchDataChangeEvent.emit(params);
      });
  }

  private setDataForTable(data) {
    if (this.nzTable.pageIndex > 1) {
      this.isCheckAll = false;
      if (AppUtilityService.isNotAnyItem(this.nzTable.items)) {
        this.nzTable.pageIndex = this.nzTable.pageIndex - 1;
        this.getGridDataSource();
        return;
      }
    }
    this.nzTable.items = data.items;
    this.nzTable.totalCount = data.totalCount;
    if (this.isResetCheckbox) {
      this.changeResetCheckbox.emit();
    } else {
      if (this.arrCheckBox != null && this.arrCheckBox.length > 0) {
        let stt = 0;
        this.nzTable.items.forEach((item) => {
          let check = this.arrCheckBox.find((m) => m.id == item.id);
          if (check != null) {
            item.isChecked = true;
            stt++;
          }
        });
        if (stt == this.nzTable.items.length) {
          this.isCheckAll = true;
        } else {
          this.isCheckAll = false;
        }
      }
    }

    this.cdref.detectChanges();
  }

  onClickRow(idx) {
    this.recordSelectedIdx = idx;
    this.recordSelectedChangeEvent.emit(this.nzTable.items[idx]);
  }

  pressUpDownKeyChangeSelectRow(event) {
    if (this.recordSelectedIdx === -1) {
      return;
    }
    if (event.keyCode === 38) {
      if (this.recordSelectedIdx === 0) {
        return;
      }
      this.onClickRow(this.recordSelectedIdx - 1);
    }
    if (event.keyCode === 40) {
      if (this.recordSelectedIdx === this.nzTable.items.length - 1) {
        return;
      }
      this.onClickRow(this.recordSelectedIdx + 1);
    }
  }

  ngAfterViewInit(): void {
    if (this.searchSchemaModel) {
      this.searchSchemaModel.searchEvent$.pipe(takeUntil(this.destroy$), debounceTime(300)).subscribe((dto) => {
        this.search(dto);
        this.searchSchemaModel.searchBtnBusy = false;
      });
    }
  }
}
