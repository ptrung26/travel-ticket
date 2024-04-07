import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { PagedResultDto, RestService } from '@node_modules/@abp/ng.core';
import { finalize, takeUntil } from '@node_modules/rxjs/operators';
import { OfSchemaModel } from '@node_modules/@orendaco/of';
import { DestroyRxjsService } from 'src/shared/destroy-rxjs.service';
import { nzTableHelper } from 'src/app-ord-base/shared/nzTableHelper';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';


@Component({
  selector: 'app-ord-pagination-fetch-data',
  templateUrl: './ord-pagination-fetch-data.component.html',
  providers: [DestroyRxjsService]
})
export class OrdPaginationFetchDataComponent implements OnInit, AfterViewInit {
  @Input() apiName = '';
  @Input() fetchApiUrl = '';
  @Output() listOfDataEvent = new EventEmitter();
  searchDto: any = {};
  nzTable: nzTableHelper;
  @Input() searchSchema: OfSchemaModel;
  @Input() pageSize = 10;
  @Input() ordSize: 'default' | 'sm' | 'md' = 'default';

  constructor(private restService: RestService,
    private destroyRxjsService: DestroyRxjsService) {
  }


  ngOnInit(): void {
    this.nzTable = new nzTableHelper();
    this.nzTable.pageSize = this.pageSize;
  }

  search(searchObj) {
    this.searchDto = _.cloneDeep(searchObj);
    this.nzTable.pageIndex = 1;
    this.getGridDataSource();
  }

  getGridDataSource() {
    const params: any = {
      ...this.searchDto,
      skipCount: this.nzTable.getSkipCount(),
      maxResultCount: this.nzTable.getMaxResultCount()
    };
    this.searchDto = _.cloneDeep(params);
    this.nzTable.loading = true;
    this.restService
      .request<any, PagedResultDto<any>>(
        {
          method: 'POST',
          url: this.fetchApiUrl,
          body: params
        },
        { apiName: this.apiName }
      )
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.nzTable.loading = false;
          });
        })
      )
      .subscribe((data) => {
        this.nzTable.loading = false;
        this.setDataTable(data);
        this.listOfDataEvent.emit(data.items);
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
    this.nzTable.items = data.items;
    this.nzTable.totalCount = data.totalCount;
  }

  ngAfterViewInit(): void {
    if (this.searchSchema) {
      this.searchSchema.searchEvent$.pipe(takeUntil(this.destroyRxjsService))
        .subscribe(dto => {
          this.search(dto);
          this.searchSchema.searchBtnBusy = false;
        });
    }
  }
}
