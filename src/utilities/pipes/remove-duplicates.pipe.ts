import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeDuplicates'
})
export class RemoveDuplicatesPipe implements PipeTransform {

  transform(array: any[], key: string): any[] {
    const uniqueArray = [];
    const seen = new Set();

    for (let item of array) {
      if (!seen.has(item[key])) {
        seen.add(item[key]);
        uniqueArray.push(item);
      }
    }
    return uniqueArray;
  }

}
