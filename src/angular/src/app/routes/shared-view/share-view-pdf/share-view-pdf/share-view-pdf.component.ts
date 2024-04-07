import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'share-view-pdf',
  templateUrl: './share-view-pdf.component.html',
  styleUrls: ['./share-view-pdf.component.scss']
})
export class ShareViewPdfComponent implements OnInit {
  @Input() path: string;
  constructor() { }

  ngOnInit(): void {
  }

}
