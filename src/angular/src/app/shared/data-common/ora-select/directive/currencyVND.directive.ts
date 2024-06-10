import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currencyVND'
})
export class CurrencyVNDPipe implements PipeTransform {

    transform(value: number): string {
        if (isNaN(value)) return '';

        // Chuyển đổi số thành định dạng tiền tệ của Việt Nam
        const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });

        return formatter.format(value);
    }
}
