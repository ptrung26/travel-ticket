import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '../../app/shared/common/AppComponentBase';
import { ISelectOption } from '../../app/shared/data-common/ora-select/model';
import { BaseServiceProxies, PagedResultDto, PagingRequest } from '../../app/shared/service-proxies/base-service-proxies.service';
import { ResponseResult } from '@app/shared/service-proxies/dto/remote-service-error.response';

@Component({
  selector: 'base-suggestion',
  templateUrl: './base-suggestion.component.html',
  styleUrls: ['./base-suggestion.component.scss'],
})
export class BaseSuggestionComponent extends AppComponentBase implements AfterViewInit, OnInit, AfterViewChecked {
  _viewContainerRefAnt: ViewContainerRef;
  _baseService: BaseServiceProxies;
  _changeDetectorRef: ChangeDetectorRef;

  pagingRequest: PagingRequest = new PagingRequest();
  pagedResult: PagedResultDto<any>;

  constructor(injector: Injector) {
    super(injector);
    this._viewContainerRefAnt = injector.get(ViewContainerRef);
    this._baseService = injector.get(BaseServiceProxies);
    this._changeDetectorRef = injector.get(ChangeDetectorRef);
  }

  private _value;
  @Input()
  get value() {
    return this._value;
  }

  set value(v: any) {
    this._value = v;
  }

  @Input() attrId = '';
  @Input() width = '';
  @Input() title = '';
  @Input() placeHolder = '';
  @Input() isMultiple = false;
  @Input() isDisabled = false;
  @Input() isGetSelectionInitial = false;
  @Input() selectedItems: ISelectOption[] = [];
  @Input() sources: any[] = [];
  @Input() isAddSources = true;
  @Input() maxItem = 10;
  @Input() isHaveExtendedInformation = false;
  @Input() isSetDefaultItem = false;
  @Output() onItemSelected = new EventEmitter();

  data: ISelectOption[] = [];
  urlApi;
  urlApiGroup;
  loading = false;
  nzSelectOpen;
  initSearch = true;
  isSetCache = false;
  isChangeFilter = false;
  isToLowerKeyword = false;
  isToUpperKeyword = false;
  isAddItemWhenNotFound = false;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    //this.search('');
  }

  ngAfterViewChecked(): void {
    this._changeDetectorRef.detectChanges();
  }

  itemSelected(value: ISelectOption | ISelectOption[]) {
    this.onItemSelected.emit(value);
  }

  focus(value) {
    if (this.isChangeFilter === true) {
      this.search(value);
    }
  }

  search(value: string) {
    if (this.sources && this.sources.length > 0) {
      this.data = this.sources;
    } else {
      if (!this.loading) {
        this.loading = true;
        let request = this.getParamsRequest(true);
        request['filter'] = value?.trim();
        this._baseService
          .post(this.getHostDomainUrl(), this.getUrlApi(), request)
          .pipe(
            finalize(() => {
              this.loading = false;
              this.isChangeFilter = false;
            }),
          )
          .subscribe((result: ResponseResult) => {
            this.pagedResult = result.result;
            if (this.pagedResult) {
              this.data = this.pagedResult?.items.map((item: any) => {
                return this.getObjectDataMap(item);
              });
            }
          });
      }
    }
  }

  reset() {
    this.initSearch = true;
    this.search('');
  }

  getHostDomainUrl() {
    return '';
  }

  getUrlApi() {
    return '';
  }

  getParamsRequest(isHasParameter?: boolean) {
    if (isHasParameter) return new PagingRequest();
    else return {};
  }

  getObjectDataMap(item: any) {
    return {
      value: item['id'],
      displayText: item['ten'],
      data: item,
    };
  }

  selectFirstItem() {
    if (this.data && this.data.length > 0) {
      this.onItemSelected.emit(this.data[0]);
    }
  }

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {}

  writeValue(obj: any): void {}
}
