import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordinalSuffix'
})
export class OrdinalSuffixPipe implements PipeTransform {

  // transform(value: any, args?: any): any {
  transform(value: any): any {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    let num = +value;
    if (num && typeof num === 'number' && Number.isInteger(num)) {
      // remainder is the last 2 digits in num
      let remainder = num % 100;

      // When num is 20 or greater than 20, the suffixes are 20th, 21st, 22nd, 23rd, 24th, 25th, ...... 29th in every 10
      // When num is less than 20, the suffixes are 0th, 1st, 2nd, 3rd, 4th, 5th, ...... 19th
      return suffixes[(num - 20) % 10] || suffixes[remainder] || suffixes[0];
    }
  }

}
