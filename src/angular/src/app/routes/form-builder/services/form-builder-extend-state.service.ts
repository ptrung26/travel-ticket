import { Injectable } from '@angular/core';
import { filter } from '@node_modules/rxjs/internal/operators';
import { OrdFormItem } from 'src/app-ord-base/ord-form/dynamic-form/dynamic-form-page.component';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';
import { BaseStateService } from 'src/shared/base-state.service';

interface ISelectOptionsState {
  [proName: string]: any[];
}

interface State {
  listOfSelectOptions: ISelectOptionsState;
}

const initialState: State = {
  listOfSelectOptions: {}
};

@Injectable({
  providedIn: 'root'
})
export class FormBuilderExtendStateService extends BaseStateService<State> {
  listOfSelectOptions$ = this.select(s => s.listOfSelectOptions)
    .pipe(filter(s => !AppUtilityService.isNullOrEmpty(s)));

  constructor() {
    super(initialState);
  }

  setSelectOptions(control: OrdFormItem, data: any[]) {
    if (control && control?.usingExtendState && !AppUtilityService.isNotAnyItem(data)) {
      const formBuilderType = control?.option?.formBuilderType;
      if (formBuilderType) {
        const listOfSelectOptions = this.state?.listOfSelectOptions || {};
        const map = listOfSelectOptions[formBuilderType] || [];
        if (control?.option?.cascaderField) {
          listOfSelectOptions[formBuilderType] = [...map, ...data];
        } else {
          listOfSelectOptions[formBuilderType] = [...data];
        }
        this.setState({
          listOfSelectOptions: null
        });
        this.setState({
          listOfSelectOptions
        });
      }
    }

  }

}
