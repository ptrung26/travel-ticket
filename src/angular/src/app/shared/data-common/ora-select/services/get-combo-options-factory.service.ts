import { Injectable } from '@angular/core';
import { ComboBoxDto } from '@app/shared/service-proxies/danh-muc-service-proxies';
import { interval, Observable, of } from '@node_modules/rxjs';
import { switchMap, tap } from '@node_modules/rxjs/internal/operators';
import { map, take } from '@node_modules/rxjs/operators';
import { ISelectOption } from '@shared/data-common/ora-select/model';

@Injectable({
  providedIn: 'root',
})
export class GetComboOptionsFactoryService {
  lock = {};
  dataOptions = {};

  constructor() {}

  getOptions(key: string, optionApi$: Observable<ComboBoxDto[]>): Observable<ISelectOption[]> {
    if (this.dataOptions[key] != null) {
      return of(this.dataOptions[key]);
    }
    if (this.lock[key]) {
      return interval(300)
        .pipe(take(1))
        .pipe(
          switchMap(() => {
            return this.getOptions(key, optionApi$);
          }),
        );
    }
    this.lock[key] = true;
    return optionApi$.pipe(
      map((lst) => {
        return lst.map((item) => {
          const res: ISelectOption = {
            value: item.value.toString(),
            displayText: item.displayText,
          };
          return res;
        });
      }),
      tap((options) => {
        this.dataOptions[key] = options;
      }),
    );
  }
}
