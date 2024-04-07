import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReadFileExcelService } from '../../../services/read-file-excel.service';

@Component({
  selector: 'ord-import-data-excel',
  templateUrl: './import-data-excel.component.html',
  styleUrls: ['./import-data-excel.component.css']
})
export class ImportDataExcelComponent implements OnInit {
  @Input() urlSampleFile = '';
  @Input() IsCustomFromServer: boolean = false;
  @Output() eventChange = new EventEmitter<any>()
  fileHopLe = false;
  file: any;

  constructor(
    private excelService: ReadFileExcelService) {
  }

  ngOnInit(): void {
  }

  readFileHandler(file) {
    this.file = file;
    this.excelService.readDataSheet(file);
  }

}
