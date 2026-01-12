import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';


@Component({
  selector: 'outer-bulk-sale',
  templateUrl: './outer-bulk-sale.component.html',
  styleUrls: ['./outer-bulk-sale.component.scss']
})
export class OuterBulkSaleComponent {
  customerForm!: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {}
  ngOnInit() {
    this.setInitialValue()
  }

  setInitialValue() {
    this.customerForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.pattern('')]],
      userName: ['', [Validators.required, Validators.pattern('')]],
      password: ['', [Validators.required, Validators.pattern('')]],
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]],
      phn: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      Address: ['', [Validators.required, Validators.pattern('')]],
      roleValue: [null, [Validators.required]]
    })
  }

  submit(formvalue:any) {

  }

  selectFile(event:any): void {
    event.preventDefault();
    const fileInput = document.getElementById('excelFileInput');
    if (fileInput) {
      fileInput.click();
    } else {
      console.error('File input element not found');
    }
  }
  
  uploadExcel(event: any): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const data = fileReader.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      };
      fileReader.readAsArrayBuffer(file);
    } else {
      console.error('No file selected');
    }
  }
}
