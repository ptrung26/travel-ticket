import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[numberCurrencyOnlyFormBuilder]'
})
export class NumberCurrencyDirective {

  // tslint:disable-next-line:variable-name
  constructor(private _el: ElementRef) {
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    var regexp = /^[0-9]*(\.[0-9]{0,2})?$/;
    let check = regexp.test(initalValue);
    if(!check){
      this._el.nativeElement.value = this._el.nativeElement.value.substring(0,this._el.nativeElement.value.length -1);
      event.stopPropagation();
    }
    // this._el.nativeElement.value = initalValue.replace(/^\d+\.\d{0,2}$/, '');
    // if (initalValue !== this._el.nativeElement.value) {
    //   event.stopPropagation();
    // }
  }

}
