import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[oraCell]',
})
export class OraCellDirective {
  constructor(public template: TemplateRef<any>) {}
}
