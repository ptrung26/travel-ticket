import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appCurrencyInput]'
})
export class CurrencyInputDirective {
    private maxLength: number = 14;

    constructor(private el: ElementRef) { }

    @HostListener('input', ['$event'])
    onInput(event: KeyboardEvent) {
        let initialValue = this.el.nativeElement.value;
        let sanitizedValue = initialValue.replace(/[^\d]/g, '');
        const caretPos = this.el.nativeElement.selectionStart;

        if (sanitizedValue.length > this.maxLength) {
            sanitizedValue = sanitizedValue.substr(0, this.maxLength);
        }

        if (initialValue !== sanitizedValue) {
            this.el.nativeElement.value = sanitizedValue;
            this.el.nativeElement.setSelectionRange(caretPos - 1, caretPos - 1);
        }

        const formattedValue = this.formatCurrency(sanitizedValue);
        this.el.nativeElement.value = formattedValue;

    }

    private formatCurrency(value: string): string {
        if (!value) return '';

        const number = parseInt(value, 10);
        if (isNaN(number)) return '';

        // Chuyển đổi số thành định dạng tiền tệ của Việt Nam
        const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });

        return formatter.format(number);
    }
}
