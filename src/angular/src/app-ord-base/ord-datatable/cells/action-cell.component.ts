import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { debounceTime, filter, takeUntil } from '@node_modules/rxjs/internal/operators';
import { ActionCellStateService } from './action-cell-state.service';
import { DestroyRxjsService } from 'src/shared/destroy-rxjs.service';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';
import { OrdActionColumn } from '../ord-column.component';

@Component({
  selector: 'ord-datatable-action-cell',
  templateUrl: './action-cell.component.html',
  providers: [DestroyRxjsService]
})
export class OrdDataTableActionCellComponent implements OnInit {
  @Input() actions: OrdActionColumn[];
  @Input() record: any;
  isNhieuHon3 = false;
  listOfActBenNgoai: OrdActionColumn[] = [];
  listActDropDown: OrdActionColumn[] = [];
  trackByIndex = (index, item) => index;

  constructor(public actionCellStateService: ActionCellStateService,
    private destroy$: DestroyRxjsService,
    private cdref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.actionCellStateService.actionCell$
      .pipe(takeUntil(this.destroy$), filter(s => AppUtilityService.isNotNull(s)))
      .subscribe(act => {
        this.actions = act.actions;
        this.isNhieuHon3 = act.isNhieuHon3;
        this.listOfActBenNgoai = act.listOfActBenNgoai;
        this.listActDropDown = act.listActDropDown;
        this.cdref.detectChanges();
      });
  }

  onClickMenuItem(record, callBackFunc) {
    callBackFunc(record);
    $('.ant-dropdown').hide();
  }
}
