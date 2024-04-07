import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: 'input[numbersOnlyFormBuilder]',
  providers: [NgModel],
})
export class NumberDirective {

  @Output() ngModelChange:EventEmitter<any> = new EventEmitter()
  // tslint:disable-next-line:variable-name
  constructor(private _el: ElementRef,private model:NgModel) {
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    if (initalValue !== this._el.nativeElement.value) {
      this.ngModelChange.emit(this._el.nativeElement.value)
      event.stopPropagation();
    }
  }

}
