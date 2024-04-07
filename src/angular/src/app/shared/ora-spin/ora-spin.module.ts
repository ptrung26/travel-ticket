import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OraSpinComponent } from './ora-spin/ora-spin.component';
import { Optional, SkipSelf } from '@angular/core';
import { NzSpinModule } from '@node_modules/ng-zorro-antd/spin';

@NgModule({
  declarations: [OraSpinComponent],
  exports: [OraSpinComponent],
  imports: [CommonModule, NzSpinModule],
})
export class OraSpinModule {
  constructor(@Optional() @SkipSelf() parentModule: OraSpinModule) {
    if (parentModule) {
      throw new Error('GreetingModule is already loaded. Import it in the AppModule only');
    }
  }
  static forRoot(): ModuleWithProviders<OraSpinModule> {
    return {
      ngModule: OraSpinModule,
      providers: [],
    };
  }
}
