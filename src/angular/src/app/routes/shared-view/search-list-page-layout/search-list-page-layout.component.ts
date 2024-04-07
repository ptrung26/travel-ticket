import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { takeUntil } from '@node_modules/rxjs/internal/operators';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';
import { DestroyRxjsService } from 'src/shared/destroy-rxjs.service';
import { TabMenuModel } from '../menu-item/tab-menu-model';
import { TabMenuStateService } from '../menu-item/tab-menu-state.service';

@Component({
  selector: 'ord-search-list-page-layout',
  templateUrl: './search-list-page-layout.component.html',
  styleUrls: ['./search-list-page-layout.component.scss'],
  providers: [DestroyRxjsService]
})
export class SearchListPageLayoutComponent implements OnInit, OnDestroy {
  @Input() tableListTitle = '';
  @Input() isTableHasSelectColBtn = false;
  //@Input() hotKeyRef: IHotKeyRef;
  private tabSelected: TabMenuModel = null;
  //private listOfHostKeyAdded: Hotkey[] = [];

  constructor(
    //private hotkeysService: HotkeysService,
    private tabState: TabMenuStateService,
    private readonly destroyService: DestroyRxjsService) {
  }

  ngOnInit(): void {
    this.tabState.tabSelected$.pipe(takeUntil(this.destroyService))
      .subscribe(tab => {
        this.tabSelected = tab;
        setTimeout(() => {
          this.initHotKey(tab);
        });
      });
  }

  initHotKey(tabSelected) {
    // if (AppUtilityService.isNullOrEmpty(tabSelected) || AppUtilityService.isNullOrEmpty(this.hotKeyRef)) {
    //   return;
    // }

  }

  ngOnDestroy(): void {

  }

}
