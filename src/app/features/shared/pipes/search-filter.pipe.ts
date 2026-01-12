import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(items: any,  value: string): any {
    if (!items) {
      return null;
    }
    if (!value) {
      return items;
    }

    return items.filter((singleItem: any) =>
     JSON.stringify(singleItem).toLowerCase().includes(value.toLowerCase())
    );
  }

}
