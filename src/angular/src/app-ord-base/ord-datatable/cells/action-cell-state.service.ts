import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';
import { BaseStateService } from 'src/shared/base-state.service';
import { OrdActionColumn } from '../ord-column.component';

interface IActionCell {
  actions: OrdActionColumn[];
  isNhieuHon3: boolean;
  listOfActBenNgoai: OrdActionColumn[];
  listActDropDown: OrdActionColumn[];
}

interface State {
  actionCell: IActionCell;
  hasAction: boolean;
}

const initialState: State = {
  actionCell: null,
  hasAction: false
};

@Injectable()

export class ActionCellStateService extends BaseStateService<State> {
  actionCell$ = this.select(s => s.actionCell);
  hasAction$ = this.select(s => s.hasAction);

  constructor() {
    super(initialState);
  }

  setAction(actions: OrdActionColumn[]) {
    if (AppUtilityService.isNotAnyItem(actions)) {
      this.setState({
        hasAction: false,
        actionCell: null
      });
      return;
    }
    _.forEach(actions, (it: OrdActionColumn) => {
      if (AppUtilityService.isNullOrEmpty(it.imgWidth)) {
        it.imgWidth = 12;
      }
      if (AppUtilityService.isNullOrEmpty(it.nzTypeBtn)) {
        it.nzTypeBtn = 'default';
      }
      if (it.nzIcon === 'delete' || it.actionType === 'xoa') {
        it.nzTypeBtn = 'danger';
        it.actionType = 'xoa';
      }
      if (it.nzIcon === 'edit' || it.actionType === 'sua') {
        it.nzTypeBtn = 'primary';
      }
      if (it.nzIcon === 'info-circle' || it.actionType === 'chi-tiet') {
        it.nzIcon = '';
        it.img = 'chi-tiet.svg';
      }
      this.getTypeIcon(it);
    });
    let isNhieuHon3 = false;
    const listOfActBenNgoai = [];
    const listActDropDown = [];
    if (actions.length > 3) {
      isNhieuHon3 = true;
      _.forEach(actions, (it, idx) => {
        if (idx < 2) {
          listOfActBenNgoai.push(it);
          return;
        }
        listActDropDown.push(it);
      });
    }
    this.setState({
      hasAction: true,
      actionCell: {
        actions,
        isNhieuHon3,
        listActDropDown,
        listOfActBenNgoai
      }
    });
  }

  private getTypeIcon(it: OrdActionColumn) {
    if (AppUtilityService.isNotNull(it?.nzIcon)) {
      it.iconType = 'nzIcon';
      return;
    }
    if (AppUtilityService.isNotNull(it?.icon)) {
      it.iconType = 'icon';
      return;
    }
    if (AppUtilityService.isNotNull(it?.img)) {
      it.iconType = 'img';
      return;
    }
  }
}
