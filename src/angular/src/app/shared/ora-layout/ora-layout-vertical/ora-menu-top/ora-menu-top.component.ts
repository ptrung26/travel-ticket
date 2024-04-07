import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@node_modules/@angular/router';
import {Menu} from '@node_modules/@delon/theme/src/services/menu/interface';

@Component({
  selector: 'ora-menu-top',
  templateUrl: './ora-menu-top.component.html',
  styleUrls: ['./ora-menu-top.component.scss'],
})
export class OraMenuTopComponent implements OnInit {
  @Input() menus: Menu[] = [];
  filterItem = (item: Menu) => {
    return item.hide === false;
  };

  constructor(private router: Router) {}

  ngOnInit(): void {}

  clickMenuItem(item: Menu) {
    const childActive = item.children.filter((x) => !x.hide && !x.disabled);
    const childFirst = childActive[0];
    if (item.extend) {
      this.router.navigate([
        item.link ? item.link : childFirst ? childFirst.link : '',
        item.link ? item.extend : childFirst ? childFirst.extend : {},
      ]);
    } else {
      this.router.navigate([item.link ? item.link : childFirst ? childFirst.link : '']);
    }

    // menu.extend ? [menu.link, menu.extend] : [menu.link]
  }
}
