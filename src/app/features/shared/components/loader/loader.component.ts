import { Component, Input, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { MenuConfigService } from "../../layouts/services/menu-config.service";

@Component({
  selector: "app-loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.scss"],
})
export class LoaderComponent implements OnInit {
  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
  }
   
}
