import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: "app-comment-modal",
  templateUrl: "./comment-modal.component.html",
  styleUrls: ["./comment-modal.component.scss"],
})
export class CommentModalComponent implements OnInit {
  constructor(
    public bsModalRef: BsModalRef,
    private modalService: BsModalService
  ) {}
  @Output() comments = new EventEmitter();
  additionalInfoNotes = "";
  disableNotes = false;
  
  ngOnInit(): void {
    const initialData: any = this.modalService.config.initialState;
    this.additionalInfoNotes = initialData?.additionalInfoNotes;
    this.disableNotes = initialData?.isDisabled || false;
  }

  submit() {
    this.comments.emit(this.additionalInfoNotes);
    this.modalService.hide("comments");
  }

  onHideModal() {
    this.modalService.hide("comments");
  }
}
