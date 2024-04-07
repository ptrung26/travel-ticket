import {
  AfterViewChecked,
  Component,
  forwardRef,
  Injector, OnChanges,
  OnInit,
  Provider,
  SimpleChanges
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { BaseSuggestionComponent } from '../../../../../app-ord-base/base-suggestion/base-suggestion.component';
import { CommonServiceProxy } from '../../../../shared/service-proxies/kho-service-proxies';

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NguoiDungSuggestionComponent),
  multi: true,
};

@Component({
  selector: 'nguoi-dung-suggestion',
  templateUrl: './nguoi-dung-suggestion.component.html',
  styleUrls: ['./nguoi-dung-suggestion.component.scss'],
  providers: [VALUE_ACCESSOR],
})

export class NguoiDungSuggestionComponent extends BaseSuggestionComponent implements OnInit, OnChanges, AfterViewChecked, ControlValueAccessor {

  constructor(injector: Injector,
    private _commonKhoService: CommonServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngAfterViewChecked(): void {
    this._changeDetectorRef.detectChanges();
  }

  search(value: string) {
    if (this.sources && this.sources.length > 0) {
      this.data = this.sources;
    } else {
      if (!this.loading) {
        this.loading = true;
        this._commonKhoService.danhsachnguoidung()
          .pipe(finalize(() => {
            this.loading = false;
          }))
          .subscribe(result => {
            this.data = result.map((item: any) => {
              return this.getObjectDataMap(item);
            });
          });
      }
    }
  }

  getObjectDataMap(item: any) {
    return {
      value: item['userId'],
      displayText: item['hoTen'],
      data: item
    };
  }

  getParamsRequest(isHasParameter?: boolean) {
    const pagingRequest = super.getParamsRequest(true);
    pagingRequest['maxResultCount'] = 900;
    return pagingRequest;
  }
}

