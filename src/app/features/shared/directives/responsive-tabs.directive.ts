import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  SimpleChanges,
} from "@angular/core";

@Directive({
  selector: "[responsiveTabs]",
})
export class ResponsiveTabsDirective {
  @HostListener("click", ["$event"]) onClick($event: any) {
    this.handleClickFunction($event);
  }

  constructor(private _el: ElementRef, private _renderer: Renderer2) {}

  ngAfterViewInit() {
    let activeText;
    const navTabs = this._el.nativeElement.querySelector(".nav-tabs");
    const liElements = navTabs.querySelectorAll(".nav-item");
    liElements.forEach((el: any) => {
      if (el.classList && el.classList.contains("active")) {
        activeText = el.firstChild.innerHTML;
      }
    });
    const child = this._renderer.createElement("li");
    child.classList.add("responsive-tab-action");
    child.innerHTML = activeText;
    this._renderer.insertBefore(navTabs, child, navTabs.firstChild);
  }

  handleClickFunction(event: any) {
    if (
      event.target &&
      event.target.classList &&
      event.target.classList.contains("responsive-tab-action")
    ) {
      const ulElement = event.target.closest("ul");
      const parentElement = event.target.parentElement;
      const childElements: Element[] = Array.from(parentElement.children);
      childElements &&
        childElements.length > 0 &&
        childElements.forEach((el: any) => {
          if (el && el.classList && !el.classList.contains("active")) {
            el.classList.toggle("show-ele");
          }
        });
      const dropdownOpenList = ulElement.querySelectorAll(".show-ele");
      if (dropdownOpenList.length > 0) {
        ulElement.classList.add("open");
      } else {
        ulElement.classList.remove("open");
      }
    }
    if (
      event.target &&
      event.target.classList &&
      event.target.classList.contains("nav-link")
    ) {
      const selectedElement = event.target;
      const parentUl = event.target.closest("ul");
      const selectedTabName = selectedElement.innerHTML;
      parentUl.firstChild.innerHTML = selectedTabName;
      const childLis: Element[] = Array.from(parentUl.children);
      childLis &&
        childLis.length > 0 &&
        childLis.forEach((el: any) => {
          if (el && el.classList) {
            el.classList.remove("show-ele");
          }
        });
      parentUl.classList.remove("open");
    }
  }
}
