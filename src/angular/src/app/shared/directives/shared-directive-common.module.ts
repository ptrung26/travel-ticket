import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LetDirective} from '@shared/directives/ng-let.directive';


@NgModule({
  declarations: [LetDirective],
  imports: [
    CommonModule
  ],
  exports: [LetDirective]
})
export class SharedDirectiveCommonModule {
}
