import {Injector} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {AppComponentBase} from './AppComponentBase';

export abstract class ModalComponentBase extends AppComponentBase {
  title = '';
  nzLabel = 8;
  nzForm = 16;
  nzModalRef: NzModalRef;
  isMustReloadGrid = false;

  constructor(injector: Injector) {
    super(injector);
    this.nzModalRef = injector.get(NzModalRef);
  }

  success(result: any = true) {
    if (result) {
      this.nzModalRef.close(result);
    } else {
      this.close();
    }
  }

  close($event?: MouseEvent): void {
    if (this.isMustReloadGrid) {
      this.success(true);
    }
    this.nzModalRef.close();
  }
}
