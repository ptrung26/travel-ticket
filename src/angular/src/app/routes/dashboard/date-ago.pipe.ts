import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo',
  pure: true,
})
export class DateAgoPipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): unknown {
    if (!value) {
      return 'vài năm trước';
    }
    let time = (Date.now() - Date.parse(value)) / 1000;
    if (time < 10) {
      return 'bây giờ';
    } else if (time < 60) {
      return 'vài giây trước';
    }
    const divider = [60, 60, 24, 30, 12];
    const string = [' giây', ' phút', ' giờ', ' ngày', ' tháng', ' năm'];
    let i;
    for (i = 0; Math.floor(time / divider[i]) > 0; i++) {
      time /= divider[i];
    }
    // const plural = Math.floor(time) > 1 ? 's' : '';
    return Math.floor(time) + string[i] + ' trước';
  }
}
