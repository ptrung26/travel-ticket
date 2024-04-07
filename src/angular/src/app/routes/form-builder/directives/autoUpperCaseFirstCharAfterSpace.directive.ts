import { Directive, ElementRef, HostListener } from '@angular/core';
import { AppUtilityService } from '@app-ord-base/services/app-utility.service';

@Directive({
  selector: 'input[autoUpperCaseFirstChar]'
})
export class AutoUpperCaseFirstCharDirective {

  // tslint:disable-next-line:variable-name
  constructor(private _el: ElementRef) {
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    let initalValue = this._el.nativeElement.value;
    initalValue = initalValue.toLowerCase();
    let arrChars = initalValue.split(' ');
    let strNew = ''
    arrChars.forEach(item => {
      strNew+= (item+' ');
    });
    this._el.nativeElement.value = strNew.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());
   
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
