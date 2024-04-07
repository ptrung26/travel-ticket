import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
  selector: 'ora-layout-filter',
  templateUrl: './ora-layout-filter.component.html',
  styleUrls: ['./ora-layout-filter.component.scss'],
})
export class OraLayoutFilterComponent implements OnInit {
  @Input() searchAfterEnter = true;
  @Output() onSearch = new EventEmitter();
  @Output() onReset = new EventEmitter();
  constructor() { }

  ngOnInit(): void { }

  search() {
    this.onSearch.emit();
  }

  reset() {
    this.onReset.emit();
  }

  onEnter() {
    if (this.searchAfterEnter) {
      this.search();
    }
  }
}
