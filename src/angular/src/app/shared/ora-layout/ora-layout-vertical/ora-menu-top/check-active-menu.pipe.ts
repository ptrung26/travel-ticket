import {Pipe, PipeTransform} from '@angular/core';
import {NavigationEnd, Router} from '@node_modules/@angular/router';
import {Menu} from '@node_modules/@delon/theme/src/services/menu/interface';
import {Observable} from '@node_modules/rxjs';
import {filter, map, startWith} from '@node_modules/rxjs/internal/operators';

@Pipe({
  name: 'checkActiveMenu',
})
export class CheckActiveMenuPipe implements PipeTransform {
  $curRouter: Observable<string>;

  constructor(private router: Router) {
    this.$curRouter = router.events.pipe(
      filter((f) => f instanceof NavigationEnd),
      map((item: NavigationEnd) => item.url),
      startWith(router.url),
    );
  }

  transform(value: Menu): Observable<boolean> {
    const flat = (array: Menu[]) => {
      let result: Menu[] = [];
      array.forEach(function (a) {
        result.push(a);
        if (Array.isArray(a.children)) {
          result = result.concat(flat(a.children));
        }
      });
      return result;
    };
    const array: Menu[] = flat([value]);
    return this.$curRouter.pipe(
      map((item) => {
        const itemFind = array.find((x) => x.link === item);
        return !!itemFind;
      }),
    );
  }
}
