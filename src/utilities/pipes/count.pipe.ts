import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'count'
})
export class CountPipe implements PipeTransform {

  transform(arr: any[], key: string, value: string | number): unknown {
    let filterItems: any[] = arr.filter((item: any) => item[key] === value);
    return filterItems.length ?? 0;
  }

}
