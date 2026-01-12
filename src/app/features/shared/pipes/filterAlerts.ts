import { Pipe, PipeTransform } from '@angular/core';
import { StorageService } from '../../http-services/storage.service';

@Pipe({
  name: 'filterAlerts'
})
export class FilterAlertsPipe implements PipeTransform {
constructor( private storageService : StorageService){}

  transform(items: any[], filter: number): any[] {
    if (!items) return [];
    if (!filter) return items;
  const filterdData =  items.filter(item => item.AlertTye == filter);
  
  if(filterdData.length == 0){
    this.storageService.setAlertValue(true)
  }
  else{
    return  filterdData
  }
    return  filterdData
  }
}
