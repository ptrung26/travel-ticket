import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'search-button',
  template: `
                  <nz-button-group >
                      <button nz-button nzType="primary" title="Tìm kiếm" (click)="searchEvent.emit()"
                              style="border-radius: 0">
                          <i nz-icon nzType="search"></i>Tìm kiếm
                      </button>
                      <!-- <button nz-button nzType="default" (click)="resetSearchEvent.emit()" title="Làm mới">
                          <i nz-icon nzType="redo"></i>
                      </button> -->
                  </nz-button-group>
                  `
})
export class SearchButtonComponent implements OnInit {
  @Output() searchEvent = new EventEmitter();
  @Output() resetSearchEvent = new EventEmitter();

  ngOnInit(): void {

  }

}
