import { Injectable, Injector } from '@angular/core';
import { Store } from '@ngxs/store';
import { OAuthService } from '@node_modules/angular-oauth2-oidc';
import { GetUserSession } from './stores/app-session/action';

@Injectable()
export class AppInitService {
  constructor(private store: Store, private injector: Injector) {}

  Init() {
    return new Promise<void>((resolve, reject) => {
      this.store
        .dispatch(new GetUserSession())
        .toPromise()
        .then(() => {
          resolve();
        });
    });
  }
}
