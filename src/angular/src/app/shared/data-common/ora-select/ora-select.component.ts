import {
  Component,
  OnInit,
  Optional,
  Inject,
  Input,
  Provider,
  forwardRef,
  OnDestroy,
  OnChanges,
  TemplateRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { Observable, Subject } from '@node_modules/rxjs';
import { debounceTime, takeUntil } from '@node_modules/rxjs/internal/operators';
import { AppUtilityService } from '@shared/services/app-utility.service';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ISelectOption, ISelectOptions, SelectOptions } from './model';

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => OraSelectComponent),
  multi: true,
};

@Component({
  selector: 'ora-select',
  templateUrl: './ora-select.component.html',
  styleUrls: ['./ora-select.component.scss'],
  providers: [VALUE_ACCESSOR],
})
export class OraSelectComponent implements OnInit, ControlValueAccessor, OnDestroy, OnChanges {
  options: ISelectOption[] = [];
  optionsSource: ISelectOption[] = [];
  @Input() options$: Observable<ISelectOption[]>;
  @Input() refNotFound: TemplateRef<any> | string = 'Không tìm thấy...';
  @Input() placeHolder = 'Chọn...';
  @Input() closeOnSelect = false;
  @Input() control = new FormControl(null);
  @Input() allowClear = true;

  isShow = false;
  $destroy = new Subject<boolean>();

  @Input()
  selectMode?: 'default' | 'multiple' | 'tags' = 'default';

  _isDisabled = false;

  @Input()
  get value(): ISelectOption {
    return this.control.value;
  }

  set value(v: ISelectOption) {
    if (!ora.equalEmpty(v, this.control.value)) {
      this.control.setValue(v);
    }
  }

  @Input()
  get isDisabled() {
    return this._isDisabled;
  }

  set isDisabled(v: boolean) {
    this._isDisabled = v;
    if (v) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  @Output() onItemSelected = new EventEmitter<ISelectOption>();
  private onChange = (v: any) => {
  };
  private onTouched = () => {
  };

  onChangeValue(event: ISelectOption): void {
    this.onChange(event?.value);
    this.onItemSelected.emit(event);
    // this.getItemSelect();
  }

  onFocus(event: any): void {
    this.onTouched();
  }

  search(value: string): void {
    value = AppUtilityService.removeDau(value);
    this.options = this.optionsSource.filter(
      (s) => AppUtilityService.removeDau(s.displayText.toLowerCase()).indexOf(value.toLowerCase()) !== -1,
    );
  }

  compareFn = (o1: ISelectOption, o2: ISelectOption) => (o1 && o2 ? o1.value === o2.value : o1 === o2);

  constructor(@Optional() @Inject(SelectOptions) private directive: ISelectOptions) {


  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }

  ngOnInit(): void {
    if (this.directive) {
      this.subOptions$(this.directive.options$);
    }
    if (this.options$) {
      this.subOptions$(this.options$);
    }
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
  }

  //#region base ControlValueAccessor
  writeValue(value: any): void {
    this.value = { value: value, displayText: '' };
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  private subOptions$(options$: Observable<ISelectOption[]>) {
    options$.pipe(takeUntil(this.$destroy), debounceTime(100))
      .subscribe((ressult) => {
        this.setOptions(ressult)
      });
  }

  private setOptions(ressult: ISelectOption[]) {
    this.options = ressult;
    this.optionsSource = ressult;
    const itemFind = this.optionsSource.find((x) => x.value === this.value?.value);
    this.isShow = true;
    if (!itemFind) {
      if (!ora.equalEmpty(undefined, this.value?.value)) {
        // this.control.reset();
      }
    } else {
    }
  }

  //#endregion
}
