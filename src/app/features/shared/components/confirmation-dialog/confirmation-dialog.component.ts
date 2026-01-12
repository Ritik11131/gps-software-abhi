import { Component, OnInit } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: "app-confirmation-dialog",
  templateUrl: "./confirmation-dialog.component.html",
  styleUrls: ["./confirmation-dialog.component.scss"],
})
export class ConfirmationDialogComponent implements OnInit {
  title: string = "Confirm";
  content: string = "Would you like to continue?";
  primaryActionLabel: string = "Ok Shopping";
  secondaryActionLabel: string = "Cancel";
  onSecondaryAction: Function = () => {};
  onPrimaryAction: Function = () => {};

  constructor(private modalService: BsModalService) {}

  handleAction(type: string) {
    type === "primary" ? this.onPrimaryAction() : this.onSecondaryAction();
    this.modalService.hide("confirmation");
  }

  ngOnInit(): void {}
}
