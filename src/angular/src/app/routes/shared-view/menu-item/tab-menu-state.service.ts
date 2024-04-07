import { Injectable } from '@angular/core';
import { Observable } from '@node_modules/rxjs';
import { BaseStateService } from 'src/shared/base-state.service';
import { TabMenuModel } from './tab-menu-model';

interface State {
  tabSelected: TabMenuModel;
}

const initialState: State = {
  tabSelected: null
};

@Injectable({
  providedIn: 'root'
})
export class TabMenuStateService extends BaseStateService<State> {
  tabSelected$: Observable<TabMenuModel> = this.select(s => s.tabSelected);

  constructor() {
    super(initialState);
  }

  setTabSelected(tab: TabMenuModel) {
    this.setState({
      tabSelected: tab
    });
  }
}
