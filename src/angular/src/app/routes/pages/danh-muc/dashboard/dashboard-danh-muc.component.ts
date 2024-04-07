import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuConfig, OraMenu, OraMenuItem } from '@app/routes/pages/danh-muc/menu.config';
import { AppUtilityService } from '@app/shared/services/app-utility.service';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@node_modules/@angular/forms';
import { BehaviorSubject, combineLatest, Subject } from '@node_modules/rxjs';
import { debounceTime, map, takeUntil } from '@node_modules/rxjs/internal/operators';
import { AppComponentBase } from '@shared/common/AppComponentBase';
import * as _ from 'lodash';

@Component({
  templateUrl: './dashboard-danh-muc.component.html',
  styleUrls: ['./dashboard-danh-muc.component.scss'],
})
export class DashboardDanhMucComponent extends AppComponentBase implements OnInit, OnDestroy {
  menuSource: OraMenu[] = new MenuConfig().configs;
  filterContr = new FormControl();
  $filter = new BehaviorSubject('');
  $menuSource = this.$filter.pipe(
    map((filter) => {
      let source = _.cloneDeep(this.menuSource);
      source = source.map((item) => {
        item.child = item.child.filter((x) => {
          const title = this.translateService.instant(x.title);
          return (
            AppUtilityService.removeDau(title).indexOf(AppUtilityService.removeDau(filter).toLowerCase()) !== -1 &&
            (this.isGranted(x.permission) || !x.permission)
          );
        });
        return item;
      });
      const all = new OraMenu(
        'Tất cả',
        '',
        '',
        _.flatMap(source, (x) => x.child),
      );
      source.unshift(all);
      return source;
    }),
  );
  $indexItemSelected = new BehaviorSubject<number>(0);
  $menuItems = combineLatest([this.$indexItemSelected, this.$menuSource]).pipe(
    map(([index, source]) => {
      return source[index].child;
    }),
  );
  $destroy = new Subject<boolean>();

  constructor(private injector: Injector, private router: Router, private translateService: TranslateService) {
    super(injector);
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }

  ngOnInit(): void {
    this.filterContr.valueChanges.pipe(debounceTime(200), takeUntil(this.$destroy)).subscribe((result) => {
      this.$filter.next(result);
    });
  }

  getImgLink(src: any) {
    return src ? '/assets/common/icon/' + src : '/assets/common/icon/icon-danh-muc/no-tobacco-day.svg';
  }

  onClickMenu(menu: OraMenu, index: number) {
    this.$indexItemSelected.next(index);
  }

  onClickMenuItem(dataItem: OraMenuItem) {
    // let x = new ReuseTabCached();
    // x.
    this.reuseTabService.init();

    this.router.navigate([dataItem.router]);
  }
}
