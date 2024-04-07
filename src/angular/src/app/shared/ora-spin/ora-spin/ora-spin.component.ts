import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { combineLatest } from '@node_modules/rxjs';
import { OraSpinService } from '@shared/ora-spin/ora-spin.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'ora-spin',
  templateUrl: './ora-spin.component.html',
  styleUrls: ['./ora-spin.component.scss', './loading-text.scss'],
})
export class OraSpinComponent implements OnInit, OnDestroy {
  @Input() messageDefault = 'Xin vui lòng đợi trong giây lát....';
  @Input() loadingTextClass = 'loading03';
  preHide = false;
  loading = false;
  private sub: Subscription;
  _message: string;
  get message(): string {
    return this._message === null || this._message === undefined ? this.messageDefault : this._message;
  }

  get messageArray(): string[] {
    return this.message.split('');
  }

  constructor(private spinService: OraSpinService, private _cdf: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.sub = this.spinService.$isLoading.subscribe((res) => {
      const loading = res;
      // this._message = res[1];
      if (loading) {
        this.loading = true;
      } else {
        this.preHide = true;
        setTimeout(() => {
          this.preHide = false;
          this.loading = false;
        }, 1000);
      }
      this._cdf.detectChanges();
    });
  }
}
