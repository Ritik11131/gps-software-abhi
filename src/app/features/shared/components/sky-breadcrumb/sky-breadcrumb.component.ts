import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumbItems } from '../../interfaces/breadcrumb-items';

@Component({
  selector: 'sky-breadcrumb',
  templateUrl: './sky-breadcrumb.component.html',
  styleUrls: ['./sky-breadcrumb.component.scss']
})
export class SkyBreadcrumbComponent {
  @Input("breadcrumbItems") breadcrumbItems: BreadcrumbItems = [];
  @Output() breadcrumbClick = new EventEmitter();

  constructor(private router: Router) {
  }

  ngOnInit(): void {}
  navigateRoute(item: any) {
    if (item?.path) {
      this.router.navigateByUrl(item.path);
    } else {
      this.breadcrumbClick.emit(item);
    }
  }
}
