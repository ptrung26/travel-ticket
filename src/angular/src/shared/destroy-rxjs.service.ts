import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from '@node_modules/rxjs';

@Injectable()
export class DestroyRxjsService extends Subject<void> implements OnDestroy {
    ngOnDestroy(): void {
       this.next();
       this.complete();
    }

}
