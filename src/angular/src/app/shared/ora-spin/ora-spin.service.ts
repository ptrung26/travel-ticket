import { Injectable } from '@angular/core';
import { Subject } from '@node_modules/rxjs';

@Injectable({
  providedIn: 'root',
})
export class OraSpinService {
  $isLoading = new Subject<boolean>();
  // $message = new Subject<string>();

  show(message?: string) {
    // this.$message.next(message);
    this.$isLoading.next(true);
  }

  hide() {
    // this.$message.next('');
    this.$isLoading.next(false);
  }

  constructor() {}
}
