import {Component, Input, OnInit} from '@angular/core';
import {Menu} from '@node_modules/@delon/theme/src/services/menu/interface';

@Component({
  selector: 'menu-top-phan-cap',
  templateUrl: './menu-top-phan-cap.component.html',
  styleUrls: ['./menu-top-phan-cap.component.scss'],
})
export class MenuTopPhanCapComponent implements OnInit {
  @Input() menus: Menu[] = [];

  constructor() {}

  ngOnInit(): void {

  }
}
