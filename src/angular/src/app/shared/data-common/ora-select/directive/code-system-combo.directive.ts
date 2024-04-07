import { Directive, Input, OnChanges, OnInit } from '@angular/core';
import { SessionKey } from '@sessionKey/*';
import { mergeMap, map, filter, debounceTime } from 'rxjs/operators';
import { DataCommonService } from '@app/shared/data-common/data-common.service';
import { BehaviorSubject } from '@node_modules/rxjs';
import { ISelectOption, ISelectOptions, SelectOptions } from '../model';
import { GetComboOptionsFactoryService } from '@shared/data-common/ora-select/services/get-combo-options-factory.service';
import { CommonServiceProxy } from '@app/shared/service-proxies/danh-muc-service-proxies';

@Directive({
  selector: '[dirCodeSystem]',
  providers: [
    {
      provide: SelectOptions,
      useExisting: CodeSystemComboDirective,
    },
  ],
})
export class CodeSystemComboDirective implements ISelectOptions, OnInit {
  options$: BehaviorSubject<ISelectOption[]> = new BehaviorSubject<ISelectOption[]>([]);
  key = 'dirCodeSystem';

  constructor(
    private _dataService: CommonServiceProxy,
    private _comboboxService: DataCommonService,
    private readonly getComboOptionsFactoryService: GetComboOptionsFactoryService,
  ) {}

  ngOnInit(): void {
    this.getDataSourceFromServer();
  }

  getDataSourceFromServer() {
    this.getComboOptionsFactoryService.getOptions(this.key, this._dataService.codeSystemCombo()).subscribe((result) => {
      this.options$.next(result);
    });
  }
}
