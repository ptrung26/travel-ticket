import {AfterViewInit, Component, Input, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
} from '@node_modules/@angular/router';
import {MenuService} from '@node_modules/@delon/theme';
import {LayoutDefaultOptions} from '@node_modules/@delon/theme/layout-default';
import {Menu} from '@node_modules/@delon/theme/src/services/menu/interface';
import {NzMessageService} from '@node_modules/ng-zorro-antd/message';
import {Subject} from '@node_modules/rxjs';
import {takeUntil} from '@node_modules/rxjs/internal/operators';

@Component({
  selector: 'ora-layout-vertical',
  templateUrl: './ora-layout-vertical.component.html',
  styleUrls: ['./ora-layout-vertical.component.scss'],
})
export class OraLayoutVerticalComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() content: TemplateRef<void>;
  @Input() rightContent: TemplateRef<void>;
  $destroy = new Subject<boolean>();
  @Input() options: LayoutDefaultOptions = {
    logoExpanded: `./assets/logo.png`,
    logoCollapsed: `./assets/logo-col.png`,
    hideAside: false,
  };
  isCollapsed = false;

  menusTop: Menu[] = [];
  isFetching = false;

  constructor(private menuService: MenuService, msgSrv: NzMessageService, private router: Router) {
    this.router.events.pipe(takeUntil(this.$destroy)).subscribe((evt) => {
      if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
        this.isFetching = true;
      }
      if (evt instanceof NavigationError || evt instanceof NavigationCancel) {
        this.isFetching = false;
        if (evt instanceof NavigationError) {
          msgSrv.error(`Could not load ${evt.url} route`, { nzDuration: 1000 * 3 });
        }
        return;
      }
      if (!(evt instanceof NavigationEnd || evt instanceof RouteConfigLoadEnd)) {
        return;
      }
      if (this.isFetching) {
        setTimeout(() => {
          this.isFetching = false;
        }, 100);
      }
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }

  ngOnInit(): void {
    const menus = this.menuService.menus;
    this.menusTop = menus[0].children.filter((x) => !x.hide);
  }
}
