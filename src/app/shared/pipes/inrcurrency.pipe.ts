import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inrcurrency',
})
export class InrcurrencyPipe implements PipeTransform {
  transform(value: number): string {
    if (value) {
      if (isNaN(value)) {
        return value.toString();
      } else {
        return (
          '₹' +
          Number(value)
            .toFixed(2)
            .replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,')
        );
      }
    } else {
      return '₹' + value;
    }
  }
}
