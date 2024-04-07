import {
  Component, EventEmitter, forwardRef, Inject,
  Input, OnDestroy, OnInit,
  Optional, Output, Provider, TemplateRef, ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, of, Subject } from '@node_modules/rxjs';
import { debounceTime, distinctUntilChanged, mergeMap } from '@node_modules/rxjs/internal/operators';
import { AppUtilityService } from '@shared/services/app-utility.service';
import * as _ from 'lodash';
import { ISelectOption, ISelectOptions, SelectOptions } from '../../app/shared/data-common/ora-select/model';

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BaseNzSelectComponent),
  multi: true,
};

@Component({
  selector: 'base-nz-select',
  templateUrl: './base-nz-select.component.html',
  styleUrls: ['./base-nz-select.component.scss'],
  providers: [VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None
})
export class BaseNzSelectComponent implements OnInit, ControlValueAccessor, OnDestroy {
  options$: Observable<ISelectOption[]> = of([]);
  optionsSource$: Observable<ISelectOption[]> = of([]);

  @Input() width = '';
  @Input() placeHolder = 'Chọn...';
  @Input() selectMode?: 'default' | 'multiple' | 'tags' = 'default';
  @Input() isMultiple?: boolean;
  @Input() nzShowSearch = true;
  @Input() nzServerSearch = true;
  @Input() nzAllowClear = true;
  @Input() nzLoading = false;
  @Input() isShowIcon = false;
  @Input() isShowImage = false;
  @Input() isAdd = false;
  @Input() isSearchAdvance = false;
  @Input() nzOpen = false;
  @Input() nzAutoFocus = true;
  @Input() nzOptionHeightPx = 32;
  @Input() nzMaxTagCount = 1;
  @Input() isVisible = true;

  @Input() refNotFound: TemplateRef<any> | string = 'Không tìm thấy...';

  @Input() closeOnSelect = false;
  @Output() onItemSelected = new EventEmitter();
  @Output() onAddOrEdit = new EventEmitter();
  @Output() onSearchAdvance = new EventEmitter();
  @Output() onSearch = new EventEmitter();
  @Output() onFocus = new EventEmitter();

  isHasDirective = false;
  searchTerm$ = new Subject<string>();
  keyword;
  subscribe: any;
  isShow = false;
  $destroy = new Subject<boolean>();

  _value: any;
  @Input()
  get value() {
    return this._value;
  }
  set value(v: any) {
    this._value = v;
  }

  _isDisabled: any;
  @Input()
  get isDisabled() {
    return this._isDisabled;
  }
  set isDisabled(v: boolean) {
    this._isDisabled = v;
  }

  _selectedItems: ISelectOption[] = [];
  @Input()
  get selectedItems() {
    return this._selectedItems;
  }

  set selectedItems(values: ISelectOption[]) {
    this._selectedItems = values;
    const selectedValues = _.map(values, (item: ISelectOption) => {
      return item.value;
    });

    this._value = this.isMultiple ? selectedValues : _.first(selectedValues);
    this.checkSelectedExists();
    this.options$ = of<ISelectOption[]>(this._sources);
  }


  _sources: ISelectOption[] = [];
  get sources() {
    return this._sources;
  }

  @Input()
  set sources(values: ISelectOption[]) {
    this._sources = values;
    if (this._sources) {
      this.options$ = of<ISelectOption[]>(this._sources);
    }
  }



  constructor(@Optional() @Inject(SelectOptions) directive: ISelectOptions) {
    this.isHasDirective = directive !== null && directive !== undefined;
    this.options$ = directive?.options$;
    this.optionsSource$ = directive?.options$;
    this.searchTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((term: string) => {
      this.onSearch.emit(term);
    });
  }

  ngOnInit(): void {
    this.selectMode = this.isMultiple ? 'multiple' : 'default';
  }

  ngOnDestroy(): void {
    //this.removeHotKey();
  }

  onChangeValue(event: any) {
    this.getItemSelected()?.subscribe((value) => {
      this.onItemSelected.emit(value);
    });

    this.onChange(event);
  }

  focus(event: any): void {
    if (!this.isHasDirective) {
      this.onFocus.emit(this.keyword);
    }
  }

  onBlur(event: any): void {
    // this.nzOpen = false;
  }

  getItemSelected() {
    if (this.isHasDirective) {
      return this.optionsSource$.pipe(mergeMap(me => {
        const value = this._value;
        const res = me.find(x => x.value === value);
        return of(res);
      },
      ));
    } else {
      const value = this._value;
      if (!this.isMultiple) {
        const res = this._sources.find(x => x.value === value);
        return of(res);
      } else {
        const res = this._sources.filter(x => value.indexOf(x.value) > -1);
        this.onItemSelected.emit(res);
      }
    }
  }

  search(value: string): void {
    this.keyword = value;

    if (this.isHasDirective) {
      value = AppUtilityService.removeDau(value);
      this.options$ = this.optionsSource$.pipe(mergeMap(me => {
        const res: ISelectOption[] = me.filter((s: ISelectOption) =>
          AppUtilityService.removeDau(s.displayText.toLowerCase()).indexOf(value.toLowerCase()) !== -1,
        );
        return of<ISelectOption[]>(res);
      }));
    } else {
      this.searchTerm$.next(value);
    }
  }

  //#region base ControlValueAccessor
  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
  }

  private onChange = (v: any) => {
  };

  private onTouched = () => {
  };

  private checkSelectedExists() {
    if (this._selectedItems) {
      if (!this._sources || this._sources.length === 0) {
        this._sources = _.filter(this._selectedItems, (it: any) => {
          return it.value;
        });
      } else {
        _.each(this._selectedItems, (selectItem: ISelectOption) => {
          const itemInfo = _.find(this._sources, (source: any) => {
            return source.value === selectItem.value;
          });

          if (itemInfo) {
            itemInfo.displayText = selectItem.displayText;
          }

          if (!itemInfo && selectItem.value) {
            this._sources.push(selectItem);
          }
        });
      }
    }
  }
}
