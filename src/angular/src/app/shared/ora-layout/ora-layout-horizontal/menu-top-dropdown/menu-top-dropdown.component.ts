import { Component, Input, OnInit } from '@angular/core';
import _ from 'lodash';

@Component({
  selector: 'menu-top-dropdown',
  templateUrl: './menu-top-dropdown.component.html',
  styleUrls: ['./menu-top-dropdown.component.scss'],
})
export class MenuTopDropdownComponent implements OnInit {
  @Input() menus;
  @Input() key: number;

  tabIndex = 0;
  listMenu = [];

  constructor() {}

  ngOnInit(): void {
    this.listMenu = _.flatMapDeep(this.menus);
    this.getTabIndex(document.location.pathname);
  }

  handleClick() {
    ora.ui.setBusy();
    ora.ui.clearBusy();
  }

  caculateMaxWidth(length: number) {
    if (length > 8) {
      return Math.ceil(length / 8) * 300;
    }

    return 300;
  }

  getTabIndex(link: string) {
    this.listMenu?.some((res, index) => {
      const checked = res.children?.some((menu) => menu.link === link) || res.link === link;

      if (checked) {
        this.tabIndex = index;
        return true;
      }
    });
  }

  getColMenu(length: number): number {
    return length <= 8 ? 24 : length <= 16 ? 12 : 8;
  }
}
