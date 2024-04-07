import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subject } from '@node_modules/rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrganizationUnitsServicesService implements OnInit, OnDestroy {
  $refresh = new Subject();

  constructor() {
  }

  ngOnInit() {
    this.$refresh.asObservable();
  }

  refreshComp() {
    this.$refresh.next();
  }

  ngOnDestroy() {
    this.$refresh.unsubscribe();
  }
}
