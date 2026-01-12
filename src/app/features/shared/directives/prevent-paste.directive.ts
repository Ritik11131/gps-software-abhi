import { Directive,  HostListener } from '@angular/core';

@Directive({
  selector: '[preventPaste]'
})
export class PreventPasteDirective {
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }
}