import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[oraHeader]',
})
export class OraHeaderDirective {
  constructor(public template: TemplateRef<any>) {}
}
