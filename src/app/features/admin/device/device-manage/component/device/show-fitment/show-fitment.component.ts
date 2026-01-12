import { Component, ElementRef, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-show-fitment',
  templateUrl: './show-fitment.component.html',
  styleUrls: ['./show-fitment.component.scss']
})
export class ShowFitmentComponent {
  @ViewChild('printSection', {static: false}) printSection!: ElementRef;
  selectDeviceId:any
  fitmentData:any
 
  constructor(
   
    private bsModalService: BsModalService
  ){}

  ngOnInit() {
   
  }

  cancel() {
    this.bsModalService.hide()
  }

  printContent() {
    let printContents = this.printSection.nativeElement.innerHTML;
    let originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    // Reset printSection content
    this.printSection.nativeElement.innerHTML = printContents;
    this.bsModalService.hide(); // Assuming you're hiding a modal or something after printing
  }
}
