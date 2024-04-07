import {Injectable} from '@angular/core';
import {Menu} from '@node_modules/@delon/theme/src/services/menu/interface';
import {BehaviorSubject} from '@node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutBasicService {
  addMenu$ = new BehaviorSubject<Menu>(null);

  constructor() {
  }

  addMenu(menu: Menu) {
    this.addMenu$.next(menu);
  }
}
