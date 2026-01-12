import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[myProfileNav]'
})
export class ResponsiveMyProfileNavDirective {

  @HostListener('click', ['$event']) onClick($event: any) {
    this.handleClickFunction($event);
  }

  constructor(
    private _el: ElementRef
  ) { }


  ngAfterViewInit() {
    const ulElement = this._el.nativeElement;
    let actionElement = ulElement.querySelector('.nav-action-li');
    setTimeout(() => {
      const activeElement = ulElement.querySelector('.nav-item.active');
      actionElement.innerHTML = activeElement.innerHTML;
    }, 0)
  }

  handleClickFunction(event: any) {

    if (event.target && event.target.classList && event.target.classList.contains('nav-action-li')) {
      const ulElement = event.target.closest('ul');
      const parentElement = event.target.parentElement;
      const childElements: Element[] = Array.from(parentElement.children);
      childElements && childElements.length > 0 && childElements.forEach((el: any) => {
        if (el && el.classList && !el.classList.contains('active')) {
          el.classList.toggle('view')
        }
      });
      const dropdownOpenList = ulElement.querySelectorAll('.view');
      if (dropdownOpenList.length > 0) {
        ulElement.classList.add('open');
      } else {
        ulElement.classList.remove('open')
      }

    }
    if (event.target && event.target.classList && event.target.classList.contains('nav-link')) {
      const selectedElement = event.target;
      const parentUl = event.target.closest('ul');
      const selectedTabName = selectedElement.innerHTML;
      parentUl.firstChild.innerHTML = selectedTabName;
      const childLis: Element[] = Array.from(parentUl.children);
      childLis && childLis.length > 0 && childLis.forEach((el: any) => {
        if (el && el.classList) {
          el.classList.remove('view')
        }
      });
      parentUl.classList.remove('open')
    }
  }

}
