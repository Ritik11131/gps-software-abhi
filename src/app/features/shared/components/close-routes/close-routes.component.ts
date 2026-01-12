import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-close-routes',
  templateUrl: './close-routes.component.html',
  styleUrls: ['./close-routes.component.scss']
})
export class CloseRoutesComponent {
  @Input() route: any;
  constructor(private router: Router) { }

  ngOnInit() {
    
  }

  close() {
    this.router.navigateByUrl(this.route)
  }
}
