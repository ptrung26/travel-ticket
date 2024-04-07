import { enableProdMode, ViewEncapsulation } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { preloaderFinished } from '@delon/theme';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

import { environment } from './environments/environment';
import { AppConsts } from '@shared/AppConsts';
// import { AppModule } from '@app/app.module';

preloaderFinished();

console.log('environment.production', environment.production);
if (environment.production) {
  enableProdMode();
}
fetch(`assets/${environment.appConfig}`)
  .then((res) => res.json())
  .then((json) => {
    AppConsts.abpEnvironment = json;
    AppConsts.abpEnvironment.production = environment.production;
    return import('./app/app.module').then((m) => m.AppModule);
  })
  .then((appModule) => {
    platformBrowserDynamic()
      .bootstrapModule(appModule, {
        defaultEncapsulation: ViewEncapsulation.Emulated,
        preserveWhitespaces: false,
      })
      .then((res) => {
        //console.log('abpEnvironment', AppConsts.abpEnvironment);
        const win = window as NzSafeAny;
        if (win && win.appBootstrap) {
          win.appBootstrap();
        }
        return res;
      })
      .catch((err) => console.error(err));
  });
//
// platformBrowserDynamic()
//   .bootstrapModule(AppModule, {
//     defaultEncapsulation: ViewEncapsulation.Emulated,
//     preserveWhitespaces: false,
//   })
//   .then((res) => {
//     const win = window as NzSafeAny;
//     if (win && win.appBootstrap) {
//       win.appBootstrap();
//     }
//     return res;
//   })
//   .catch((err) => console.error(err));
