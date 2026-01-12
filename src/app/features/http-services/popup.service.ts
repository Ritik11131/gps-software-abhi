import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private isOpen = false;
  private data: any;

  constructor() {}

  open(data: any) {
    this.isOpen = true;
    this.data = data;
  }

  close() {
    this.isOpen = false;
    this.data = null;
  }

  isOpened() {
    return this.isOpen;
  }

  getData() {
    return this.data;
  }
}
