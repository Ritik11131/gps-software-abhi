import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TabsService {
  private tabsSubject = new BehaviorSubject<any[]>([]);
  tabs$ = this.tabsSubject.asObservable();
  storedTabs: any;

  constructor(private storageService: StorageService
    , private router : Router) {
    this.storedTabs = this.storageService.getItems('tabs');
    if (this.storedTabs) {
      this.tabsSubject.next(JSON.parse(this.storedTabs));
    }
  }

  addTab(tabName: any) {
    const currentTabs = this.tabsSubject.getValue() || [];
  const duplicateIndex = currentTabs.findIndex(tab => tab.name === tabName.name);

  if (duplicateIndex === -1) {
    const newTabs = currentTabs.map(tab => ({ ...tab, active: false }));
    const newTab = { ...tabName, active: true };
    newTabs.push(newTab);
    this.tabsSubject.next(newTabs);
    this.storageService.setItems('tabs', JSON.stringify(newTabs));
  } else {
    this.setActive(tabName.name); // Set the tab as active if it's a duplicate
  }
  }
  setActive(tabName: string) {
    const currentTabs = this.tabsSubject.getValue() || [];
    const index = currentTabs.findIndex(tab => tab.name === tabName);
    if (index !== -1) {
      const newTabs = currentTabs.map((tab, i) => ({ ...tab, active: i === index }));
      this.tabsSubject.next(newTabs);
      this.storageService.setItem('tabs', JSON.stringify(newTabs)); // Store tabs data in storage
    }
  }
  removeTab(tabName: string) {
    const currentTabs = this.tabsSubject.getValue() || [];
    const index = currentTabs.findIndex(tab => tab.name === tabName);
    
    if (index !== -1) {
      let newTabs = currentTabs.filter(tab => tab.name !== tabName);
  
      // Set the previous tab as active if the removed tab was active
      if (currentTabs[index].active && index > 0) {
        newTabs[index - 1].active = true;
        this.router.navigateByUrl(newTabs[index - 1].path);
      }
  
      this.tabsSubject.next(newTabs);
      this.storageService.setItems('tabs', JSON.stringify(newTabs));
    }
  }
  
}
