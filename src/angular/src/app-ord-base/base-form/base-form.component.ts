import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injector,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { AppComponentBase } from '../../app/shared/common/AppComponentBase';

@Component({
  selector: 'base-form',
  templateUrl: './base-form.component.html',
  styleUrls: ['./base-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseFormComponent<T> extends AppComponentBase implements OnInit, OnDestroy, OnChanges {
  @Output() onSaveSuccess = new EventEmitter();
  @Output() backListEvent = new EventEmitter<boolean>();

  saving = false;
  model: T;
  rfFormData: FormGroup;
  $destroy = new Subject<boolean>();
  permission: any;
  nzModalRef: NzModalRef;

  constructor(injector: Injector) {
    super(injector);
    this.nzModalRef = injector.get(NzModalRef);
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }

  save() {}

  close(isSave: boolean) {
    this.resetForm();
    this.backListEvent.emit(isSave);
  }

  resetForm(): void {
    try {
      if (this.rfFormData) {
        this.rfFormData?.reset();

        // tslint:disable-next-line:forin
        for (const key in this.rfFormData.controls) {
          this.rfFormData.controls[key].markAsPristine();
          this.rfFormData.controls[key].updateValueAndValidity();
        }
      }
    } catch (e) {
      // console.log(e);
    }
  }
}
