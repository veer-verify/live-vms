import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(array: any[], value: string): any {
    return array.sort((a: any, b: any) => a[value].toLowerCase() < b[value].toLowerCase() ? -1 : a[value].toLowerCase() > b[value].toLowerCase() ? 1 : 0);
  }

}
