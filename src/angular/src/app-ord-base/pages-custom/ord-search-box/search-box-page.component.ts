import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { DynamicFormPageComponent, OrdFormItem } from '../../ord-form/dynamic-form/dynamic-form-page.component';
import * as _ from 'lodash';
import { Subject } from '@node_modules/rxjs';
import { debounceTime, takeUntil } from '@node_modules/rxjs/internal/operators';
import { DestroyRxjsService } from 'src/shared/destroy-rxjs.service';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';

export interface OrdSearchLayout {
  layout?: 'horizontal' | 'vertical';
  controlWidth?: number; //width của những search control khi hiển thị được tính bằng col-md
  groups: OrdFormItem[];
  advanceGroups?: OrdFormItem[];
  searchDtoReset?: any;
}

@Component({
  selector: 'ord-search-box-page',
  templateUrl: './search-box-page.component.html',
  styleUrls: ['./search-box-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DestroyRxjsService],
})
export class SearchBoxPageComponent implements OnInit, AfterContentInit {
  @ViewChild('normalSearch', { static: false }) normalSearch: DynamicFormPageComponent;
  @Input() requiredValidate = false;
  @Input() searchModel: any = {};
  @Output() searchModelChange = new EventEmitter();
  @Input() searchLayout: OrdSearchLayout;
  @Input() filterCtrlTempalte: TemplateRef<any>;
  @Input() autoSearchAfterViewInit = true;
  @Output() searchEvent = new EventEmitter();
  @Output() refreshFilterEvent = new EventEmitter();
  @Input() searchDtoReset: any = {};
  @Input() hasBtnSearchBottom: any;
  @Input() isRefresh: boolean = true;
  showAdvancedSearch = false;
  hasAdvancedSearch = false;
  private oldOfDataForm: any;
  private dataFieldAutoReSearch: string[] = [];
  private hasAutoSearch = false;
  changeData$ = new Subject<any>();

  constructor(private destroy$: DestroyRxjsService) {}

  ngOnInit(): void {
    this.getArrDataFieldAutoReSearch();
    if (this.hasAutoSearch) {
      this.changeData$
        .pipe(takeUntil(this.destroy$))
        .pipe(debounceTime(50))
        .subscribe((d) => {
          this.autoSearch(d);
        });
    }
    if (AppUtilityService.isNullOrEmpty(this.hasBtnSearchBottom)) {
      this.hasBtnSearchBottom = true;
    }
  }

  ngAfterContentInit(): void {
    if (this.autoSearchAfterViewInit) {
      setTimeout(() => {
        this.search();
      });
    }
  }

  getArrDataFieldAutoReSearch() {
    const arrAutoSearch = _.filter([...(this.searchLayout.groups ?? []), ...(this.searchLayout.advanceGroups ?? [])], (it: OrdFormItem) => {
      return it?.isAutoSearchWhenChange;
    });
    this.dataFieldAutoReSearch = _.map(arrAutoSearch, (it: OrdFormItem) => {
      return it.dataField;
    });
    this.hasAutoSearch = !AppUtilityService.isNotAnyItem(this.dataFieldAutoReSearch);
    if (this.searchLayout?.searchDtoReset) {
      this.searchDtoReset = this.searchLayout?.searchDtoReset;
    }
    this.hasAdvancedSearch = !AppUtilityService.isNotAnyItem(this.searchLayout?.advanceGroups);
    this.searchModel = _.cloneDeep(this.searchDtoReset);
  }

  search() {
    this.searchModelChange.emit(this.searchModel);
    this.searchEvent.emit(this.searchModel);
  }

  resetSearch() {
    this.searchModel = _.cloneDeep(this.searchDtoReset);
    if (this.isRefresh) {
      this.search();
    }
  }

  clickShowAdvancedSearch() {
    this.showAdvancedSearch = true;
  }

  clickHideAdvancedSearch() {
    this.searchLayout.advanceGroups.forEach((ctl) => {
      this.searchModel[ctl.dataField] = null;
    });
    this.showAdvancedSearch = false;
  }

  autoSearch(data: any) {
    if (this.oldOfDataForm) {
      const f = _.find(this.dataFieldAutoReSearch, (df) => {
        // tslint:disable-next-line:triple-equals
        return this.oldOfDataForm[df] != data[df];
      });
      if (f) {
        this.search();
      }
    }
    this.oldOfDataForm = _.cloneDeep(data);
  }

  onChangeDataForm($event: any) {
    if ((this.requiredValidate = true)) {
      let isValid = this.normalSearch.getDataForm();
      if (AppUtilityService.isNullOrEmpty(isValid)) {
        this.searchModel.isValid = false;
      } else {
        this.searchModel.isValid = true;
      }
    }
    if (this.hasAutoSearch) {
      this.changeData$.next($event);
    }
  }
}
