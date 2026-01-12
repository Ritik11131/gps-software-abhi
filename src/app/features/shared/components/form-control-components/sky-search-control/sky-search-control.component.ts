import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { Router } from "@angular/router";


declare var window: any;

@Component({
  selector: "sky-search-control",
  templateUrl: "./sky-search-control.component.html",
  styleUrls: ["./sky-search-control.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => skySearchControlComponent),
    },
  ],
})
export class skySearchControlComponent implements OnInit {
  @ViewChild("searchBoxInput") searchBoxInput!: ElementRef<any>;
  @Input("disabled") disabled: boolean = false;
  @Input("placeholder") placeholder: string = "";
  @Input("value") value: string = "";
  @Input("isGlobalSearchEnabled") isGlobalSearchEnabled: Boolean = true;
  @Output() change: EventEmitter<string> = new EventEmitter<string>();
  @Output() input: EventEmitter<string> = new EventEmitter<string>();
  @Output() blur: EventEmitter<string> = new EventEmitter<string>();
  @Output() keypress: EventEmitter<string> = new EventEmitter<string>();
  @Output() keydown: EventEmitter<string> = new EventEmitter<string>();
  @Output() keyup: EventEmitter<string> = new EventEmitter<string>();
  @Output() sendValue: EventEmitter<string> = new EventEmitter<string>();
  @Input() searchByIcon = false;
  searchDefaultValue: string = "";
  searchCurrentPage = 0;
  searchResultFields = "FULL";
  searchResultsPageSize = 20;
  suggestionsFields = "DEFAULT";
  suggestionMaxSize = 10;
  filteredProducts: any = [];
  @Input() searchKey: string = "";
  constructor(
    // private skySearchControlService: skySearchControlService,
    private router: Router
  ) {}

  onChange = (_: any) => {};
  onTouch = (_: any) => {};

  writeValue(value: string): void {
    this.searchDefaultValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  ngOnInit(): void {
    let _this = this;
    if (this.value) this.searchDefaultValue = this.value;
    window.addEventListener("click", function (e: any) {
      if (document.getElementById("product-dropDown")!.contains(e.target)) {
      } else {
        if (_this.filteredProducts.length) _this.filteredProducts = [];
      }
    });
  }

  onClearInput() {
    this.searchKey = "";
    this.input.emit(this.searchDefaultValue);
    this.searchDefaultValue = "";
    this.searchBoxInput.nativeElement.value = "";
    this.input.emit(this.searchDefaultValue);
    this.sendValue.emit("");
    this.filteredProducts = [];
  }
  onchange(event: Event){
    this.sendValue.emit(this.searchKey);
  }

  // onInputEvent(event: Event) {
  //   if (this.isGlobalSearchEnabled) {
  //     if (!this.searchByIcon) {
  //       this.searchDefaultValue =
  //         (event.target as HTMLInputElement).value || "";
  //       this.onChange(this.searchBoxInput);
  //       this.input.emit(this.searchDefaultValue);
  //       this.filteredProducts = [];
  //       if (this.searchDefaultValue.length >= 3) {
  //         if (this.isGlobalSearchEnabled) {
  //           this.skySearchControlService
  //             .searchResults(
  //               this.searchCurrentPage,
  //               this.searchResultFields,
  //               this.searchResultsPageSize,
  //               this.searchKey
  //             )
  //             .subscribe((res: any) => {
  //               this.filteredProducts = res.products;
  //             });
  //         }
  //       }
  //     }
  //   }
  // }
  onSuggestionClick(productId: any) {
    let navigateUrl = "";
    if (productId.substring(0, 1) === "R") {
      navigateUrl = "/residential/products/details/" + productId;
    }
    if (productId.substring(0, 1) === "C") {
      navigateUrl = "/commercial/products/details/" + productId;
    }
    let compInstance = document.getElementsByTagName("app-pdp");
    if (compInstance.length > 0) {
      let instance = window["ng"].getComponent(compInstance[0]);
      if (instance) {
        instance.setSelectedProductItem({ code: productId });
      }
    }
    this.router.navigateByUrl(navigateUrl);
    this.filteredProducts = [];
  }

  onBlurEvent(event: Event) {
    if (!this.searchByIcon) {
      this.searchDefaultValue = (event.target as HTMLInputElement).value || "";
      this.blur.emit(this.searchDefaultValue);
    }
  }

  onKeypress(event: Event) {
    if (!this.searchByIcon) {
      this.searchDefaultValue = (event.target as HTMLInputElement).value || "";
      this.keypress.emit(this.searchDefaultValue);
    }
  }

  onKeydown(event: Event) {
    if (this.isGlobalSearchEnabled) {
      this.searchDefaultValue = (event.target as HTMLInputElement).value || "";
      if (!this.searchByIcon) {
        this.keypress.emit(this.searchDefaultValue);
      }
    }
  }

  onKeyup(event: Event) {
    if (this.isGlobalSearchEnabled) {
      if (!this.searchByIcon) {
        this.searchDefaultValue =
          (event.target as HTMLInputElement).value || "";
        this.keyup.emit(this.searchDefaultValue);
      }
    }
  }
  onEnter() {
    // if (this.filteredProducts.length > 0) {
    //   let urlSegments = this.filteredProducts
    //     .find((product: any) => !!product.categoryName)
    //     .categoryName?.substring(
    //       1,
    //       this.filteredProducts.find((product: any) => !!product.categoryName)
    //         .categoryName.length - 1
    //     );
    //   let arr: Array<string> = urlSegments.split(',');
    //   let navigatePLPUrl = '';
    //   if (arr[2].toLowerCase().indexOf('wood') != -1) {
    //     navigatePLPUrl = '/products?name=Wood&page=View%20All%20Wood&type=wood';
    //   }
    //   if (arr[2].toLowerCase().indexOf('cushion') != -1) {
    //     navigatePLPUrl =
    //       '/products?name=Cushion&page=View%20All%20Cushion&type=cushionproduct';
    //   }
    //   if (arr[2].toLowerCase().indexOf('carpet') != -1) {
    //     navigatePLPUrl =
    //       '/products?name=Carpet&page=View%20All%20Carpet&type=carpetproduct';
    //   }
    //   if (arr[2].toLowerCase().indexOf('tile') != -1) {
    //     navigatePLPUrl = '/products?name=Tile&page=View%20All%20Tile&type=tile';
    //   }
    //   if (
    //     arr[2].toLowerCase().indexOf('resilient') != -1 ||
    //     arr[2].toLowerCase().indexOf('vinyl') != -1
    //   ) {
    //     navigatePLPUrl =
    //       '/products?name=Resilient%2FVinyl&page=View%20All%20Resilient%2FVinyl&type=resilient_vinyl';
    //   }
    //   if (arr[2].toLowerCase().indexOf('merchandising') != -1) {
    //     navigatePLPUrl =
    //       '/products?name=Merchandising&page=View%20All%20Merchandising&type=merchandising';
    //   }
    //   if (
    //     arr[2].toLowerCase().indexOf('accessories') != -1 ||
    //     arr[2].toLowerCase().indexOf('installation') != -1
    //   ) {
    //     navigatePLPUrl =
    //       '/products?name=Installation%20Accessoires&page=View%20All%20Installation%20Accessoires&type=accessories';
    //   }
    //   if (urlSegments.toLowerCase().indexOf('residential') != -1) {
    //     navigatePLPUrl = '/residential' + navigatePLPUrl;
    //   }
    //   if (urlSegments.toLowerCase().indexOf('commercial') != -1) {
    //     navigatePLPUrl = '/commercial' + navigatePLPUrl;
    //   }
    //   this.router.navigateByUrl(navigatePLPUrl);
    //   this.filteredProducts = [];
    // }
    if (this.isGlobalSearchEnabled) {
      this.navigateToPlp();
    }
  }
  onSearch() {
    // if (this.isGlobalSearchEnabled) {
    //   this.skySearchControlService
    //     .searchResults(
    //       this.searchCurrentPage,
    //       this.searchResultFields,
    //       this.searchResultsPageSize,
    //       this.searchKey
    //     )
    //     .subscribe((res: any) => {
    //     });
    // }
    this.sendValue.emit(this.searchKey);
    if (this.isGlobalSearchEnabled) {
      this.navigateToPlp();
    }
  }
  navigateToPlp() {
    let navigatePLPUrl = `/products?search=${this.searchKey}`;
    if (this.router.url?.split("?")[0].includes("residential")) {
      navigatePLPUrl = "/residential" + navigatePLPUrl;
    } else if (this.router.url?.split("?")[0].includes("commercial")) {
      navigatePLPUrl = "/commercial" + navigatePLPUrl;
    }
    // const navigatePLPUrl = `/products?search=${this.searchKey}`;
    this.filteredProducts = [];
    this.searchKey = "";
    this.router.navigateByUrl(navigatePLPUrl);
  }
}
