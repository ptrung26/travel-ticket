import { Injectable } from '@angular/core';
import { SysRoleDto } from '@app/shared/service-proxies/tai-khoan-service-proxies';
import { BaseStateService } from 'src/shared/base-state.service';

interface State {
  itemSelected: SysRoleDto;
}

const initialState: State = {
  itemSelected: null
};

@Injectable({
  providedIn: 'root'
})
export class RoleCoSoStateService extends BaseStateService<State> {
  itemSelected$ = this.select(s => s.itemSelected);

  constructor() {
    super(initialState);

  }

  reset() {
    this.setState({
      ...initialState
    });
  }

  selectRoleRow(record: SysRoleDto) {
    this.setState({
      itemSelected: record
    });
  }


}
