import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'view-pdf',
  templateUrl: './view-pdf.component.html',
  styleUrls: ['./view-pdf.component.scss'],
})
export class ViewPdfSharedComponent implements OnInit {
  @Input() path;
  constructor() {}

  ngOnInit(): void {}
}
