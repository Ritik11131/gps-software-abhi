import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { StorageService } from "src/app/features/http-services/storage.service";

@Component({
  selector: "app-table-view",
  templateUrl: "./table-view.component.html",
  styleUrls: ["./table-view.component.scss"],
})
export class TableViewComponent implements OnInit {
  @Input() columns: any = [];
  @Input() tableData: any = [];
  @Input() redirectionObj: any = [];
  public selected = new Set();
  @Input() selectSearchType: string = "";
  @Input() searchKeyValue: any = "";
  @Input() checkboxes: boolean = false;
  @Input() pagination: boolean = false;
  @Input() selectAll: boolean = false;
  @Input() minimal?: boolean = false;
  @Input() id: any = "";
  @Input() datastore?: string = "selectedReceivables";
  @Input() showOutput: boolean = true;
  // @Input() datastore?: string = 'selectedReceivables';

  @Output() recordsSelected = new EventEmitter();
  constructor(private router: Router, private storageService: StorageService) {}

  ngOnInit(): void {}
  tableEvent(type: string, e?: any, index?: any): void {
    switch (type) {
      case "onCheckboxSelect":
        this.tableData[index].checked = e.checked;

        if (this.selected.has(index)) {
          this.selected.delete(index);
        } else {
          this.selected.add(index);
        }
        // if (!!this.datastore) {
        //   this.storeSelected();
        // }
        if (this.selected.size == this.tableData.length) {
          this.selectAll = true;
        } else if (
          this.selected.size == 0 ||
          this.selected.size < this.tableData.length
        ) {
          this.selectAll = false;
        }

        break;
      case "onSelectAll":
        this.selectAll = !this.selectAll;
        this.tableData.forEach((ele: any) => {
          ele.checked = this.selectAll;
        });
        if (this.selectAll) {
          this.selected.clear();
          this.tableData.forEach((receivable: any) => {
            this.selected.add(this.tableData.indexOf(receivable));
          });
          // if (!!this.datastore) {
          //   this.storeSelected();
          // }
        } else {
          this.selected.clear();
        }
        break;
    }

    this.recordsSelected.emit(this.selected);
  }

  // storeSelected() {
  //   if (!!this.datastore) {
  //     this.storageService.setItem(
  //       this.datastore,
  //       this.tableData
  //         .filter((receivable: any) => receivable.checked)
  //         .map((receivable: any) => {
  //           return {
  //             ...receivable,
  //             checked: false,
  //           };
  //         })
  //     );
  //   }
  // }

  previousKey = {
    active: "",
    direction: "asc",
  };
  sortData(name: any) {
    let sort = {
      active: name,
      direction: this.previousKey.direction,
    };
    if (this.previousKey.active == sort.active) {
      sort.active = name;
      if (sort.direction == "asc") {
        sort.direction = "desc";
      } else {
        sort.direction = "asc";
      }
    } else if (this.previousKey.active != sort.active) {
      sort.active = name;
      sort.direction = "asc";
    }
    this.previousKey = {
      active: name,
      direction: sort.direction,
    };

    const data = this.tableData.slice();
    if (!sort.active || sort.direction === "") {
      this.tableData = data;
      return;
    }

    this.tableData = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === "asc";
      return this.compare(a[sort.active], b[sort.active], isAsc);
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a ? (a <= b ? -1 : 1) : -1) * (isAsc ? 1 : -1);
  }
  pageIndex: number = 1;
  tableItemsSize: number = 10;
  startValue: number =
    this.pageIndex * this.tableItemsSize - (this.tableItemsSize - 1);
  lastValue: number = this.startValue + this.tableItemsSize - 1;

  onTableDataChange(event: any) {
    this.pageIndex = event;
    this.startValue =
      this.pageIndex * this.tableItemsSize - (this.tableItemsSize - 1);
    this.lastValue = this.startValue + this.tableItemsSize - 1;
    this.lastValue =
      this.lastValue > this.tableData.length
        ? this.tableData.length
        : this.lastValue;
  }

  goTo(link: any, claimNum: any, selectedItem: any) {
    let url = link;
    if (selectedItem.claimStatus.toUpperCase() == "DRAFT") {
      url = url + "draft";
      this.storageService.setItem("claimNumber", claimNum);
    } else {
      url = url + claimNum;
    }
    this.router.navigateByUrl(url);
  }
  setSelectAll() {
    const allSelected = this.tableData.filter(
      (item: any) => item.checked === true
    );
    return allSelected.length === this.tableData.length;
  }
}
