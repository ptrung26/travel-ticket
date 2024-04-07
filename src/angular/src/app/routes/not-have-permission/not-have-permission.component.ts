import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/AppComponentBase';

@Component({
  templateUrl: './not-have-permission.component.html',
  styleUrls: ['./not-have-permission.component.scss'],
})
export class NotHavePermissionComponent extends AppComponentBase implements OnInit {
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.setTitleTab('Phân quyền');
  }
}
