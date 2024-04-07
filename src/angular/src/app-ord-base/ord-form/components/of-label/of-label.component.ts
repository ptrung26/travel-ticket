import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslatePipe } from '@node_modules/@ngx-translate/core';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';

@Component({
  selector: 'of-label',
  templateUrl: './of-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [TranslatePipe],
})
export class OfLabelComponent implements OnInit {
  @Input() isVerticalLayout = true;
  @Input() label = '';
  @Input() labelHtml = '';
  @Input() fontSize = '14px';
  @Input() required = false;
  show = false;

  constructor(private translatePipe: TranslatePipe) { }

  ngOnInit(): void {
    if (!AppUtilityService.isNullOrEmpty(this.label)) {
      this.labelHtml = this.translatePipe.transform(this.label);
    }
    this.show = !AppUtilityService.isNullOrEmpty(this.labelHtml);
  }
}
