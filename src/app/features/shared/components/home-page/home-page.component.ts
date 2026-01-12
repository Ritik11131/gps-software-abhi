import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  constructor () {
    window.scrollTo({
      top:0
    })
   }
  mainSliderOptions: OwlOptions = {
    loop: true,
    navText: ["", ""],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: { items: 1 },
    },
    nav: true,
  };
  sliderOptions: OwlOptions = {
    loop: false,
    navText: ["", ""],
    dots: false,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 2,
      },
      940: { items: 3 },
    },
    nav: false,
    margin: 15,
  };
}
