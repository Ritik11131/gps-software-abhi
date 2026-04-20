import { Component } from '@angular/core';
import { DeviceManageService } from '../../service/device-manage.service';
import * as XLSX from 'xlsx';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-device-bulk-upload',
  templateUrl: './device-bulk-upload.component.html',
  styleUrls: ['./device-bulk-upload.component.scss']
})
export class DeviceBulkUploadComponent {
  spinnerLoading: boolean = false;
  selectedFile: File | null = null;
  columns: any;
  bulkDeviceData: any[] = [];
  page = 1;
  count = 0;
  tableSize = 10;
  selectedFileName: any = '';
  parsedRows: any[] = [];
  readonly sampleColumns: string[] = [
    'deviceId',
    'deviceImei',
    'deviceUid',
    'simPhoneNumber',
    'fkSimOperator',
    'fkSecSimOperator',
    'simSecPhoneNumber',
    'fkDeviceType',
    'fkVehicleType',
    'vehicleNo',
    'installationOn',
    'nextRecharge',
    'description'
  ];

  constructor(
    private deviceManageService: DeviceManageService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.setInitialValue();
  }

  setInitialValue() {
    this.columns = [
      { key: 'deviceId', title: 'Device Id' },
      { key: 'deviceImei', title: 'Device IMEI' },
      { key: 'deviceUid', title: 'Device UID' },
      { key: 'simPhoneNumber', title: 'Primary SIM Number' },
      { key: 'fkSimOperator', title: 'Primary SIM Operator' },
      { key: 'simSecPhoneNumber', title: 'Secondary SIM Number' },
      { key: 'fkSecSimOperator', title: 'Secondary SIM Operator' },
      { key: 'fkDeviceType', title: 'Device Type' },
      { key: 'fkVehicleType', title: 'Vehicle Type' },
      { key: 'vehicleNo', title: 'Vehicle Number' },
      { key: 'nextRecharge', title: 'Next Recharge' },
      { key: 'description', title: 'Description' },
      { key: 'Result', title: 'Result' },
    ];
  }

  downloadExcel() {
    const sampleRows = [
      {
        deviceId: 'DEV-1001',
        deviceImei: '356938035643809',
        deviceUid: 'UID-1001',
        simPhoneNumber: '9876543210',
        fkSimOperator: '1',
        simSecPhoneNumber: '9988776655',
        fkSecSimOperator: '2',
        fkDeviceType: '3',
        fkVehicleType: '4',
        vehicleNo: 'MH12AB1234',
        installationOn: '2026-04-01',
        nextRecharge: '2026-05-01',
        description: 'Demo device 1'
      },
      {
        deviceId: 'DEV-1002',
        deviceImei: '356938035643810',
        deviceUid: 'UID-1002',
        simPhoneNumber: '9123456780',
        fkSimOperator: '1',
        simSecPhoneNumber: '9112233445',
        fkSecSimOperator: '2',
        fkDeviceType: '3',
        fkVehicleType: '5',
        vehicleNo: 'DL8CAF1234',
        installationOn: '2026-04-02',
        nextRecharge: '2026-05-02',
        description: 'Demo device 2'
      }
    ];
    const ws = XLSX.utils.json_to_sheet(sampleRows, { header: this.sampleColumns });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DeviceUpload');
    XLSX.writeFile(wb, 'Device_Bulk_Upload_Sample.xlsx');
  }

  selectFile(event: any): void {
    event.preventDefault();
    const fileInput = document.getElementById('excelFileInput');
    if (fileInput) {
      fileInput.click();
    } else {
      console.error('File input element not found');
    }
  }

  uploadExcel(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.selectedFileName = fileInput.files[0].name;
      this.previewSelectedFile();
    } else {
      console.error('No file selected');
    }
  }

  getBulkDeviceList() {
    if (!this.parsedRows.length) {
      this.notificationService.showError('No data found to upload');
      return;
    }
    // Prevent duplicate rows/statuses when user clicks upload again
    this.bulkDeviceData.forEach((row) => row.entry_status_message = 'Pending');
    this.spinnerLoading = true;
    this.uploadRowsSequentially(0, 0, 0);
  }

  private uploadRowsSequentially(index: number, successCount: number, failureCount: number) {
    if (index >= this.parsedRows.length) {
      this.spinnerLoading = false;
      this.count = this.bulkDeviceData.length;
      if (failureCount === 0) {
        this.notificationService.showSuccess(`All ${successCount} devices uploaded successfully`);
        this.router.navigateByUrl('/admin/device/device-manage');
      } else {
        this.notificationService.showError(`${failureCount} failed, ${successCount} uploaded successfully`);
      }
      return;
    }

    const rawRow = this.parsedRows[index];
    const payload = this.createPayload(rawRow);
    const rowView = this.bulkDeviceData[index];

    this.deviceManageService.addDevice(payload).subscribe((res: any) => {
      const isSuccess = !!(res?.status === 200 || res?.status === 201) && (res?.body?.result !== false);
      rowView.entry_status_message = isSuccess
        ? 'Success'
        : (res?.body?.data || res?.error?.data || res?.error?.message || 'Failed');
      this.count = this.bulkDeviceData.length;
      this.uploadRowsSequentially(index + 1, isSuccess ? successCount + 1 : successCount, isSuccess ? failureCount : failureCount + 1);
    }, (err: any) => {
      rowView.entry_status_message = err?.error?.data || err?.error?.message || 'Failed';
      this.count = this.bulkDeviceData.length;
      this.uploadRowsSequentially(index + 1, successCount, failureCount + 1);
    });
  }

  private previewSelectedFile() {
    if (!this.selectedFile) return;
    this.bulkDeviceData = [];
    this.parsedRows = [];
    this.count = 0;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        this.parsedRows = this.parseSheetRows(worksheet);
        if (!this.parsedRows.length) {
          this.notificationService.showError('No data found in uploaded file');
          return;
        }
        this.bulkDeviceData = this.parsedRows.map((row) => this.createResultRow(row));
        this.bulkDeviceData.forEach((row) => row.entry_status_message = 'Pending');
        this.count = this.bulkDeviceData.length;
        this.page = 1;
      } catch (error) {
        this.notificationService.showError('Unable to read uploaded file');
      }
    };
    reader.onerror = () => {
      this.notificationService.showError('Unable to read uploaded file');
    };
    reader.readAsArrayBuffer(this.selectedFile);
  }

  refreshPage() {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.bulkDeviceData = [];
    this.parsedRows = [];
    this.count = 0;
  }

  /**
  * table data change
  * @param event 
  */
  onTableDataChange(event: any) {
    this.page = event;
  }

  private createPayload(row: any) {
    const get = (keys: string[]) => {
      for (const key of keys) {
        if (row?.[key] !== undefined && row?.[key] !== null && row?.[key] !== '') return row[key];
      }
      return '';
    };

    const toNumber = (value: any, fallback = 0) => {
      const n = Number(value);
      return Number.isFinite(n) ? n : fallback;
    };

    const installationDate = this.formatExcelDate(get(['installationOn', 'InstallationOn', 'installation_date']));
    const nextRecharge = get(['nextRecharge', 'NextRecharge', 'next_recharge']);

    return {
      deviceId: String(get(['deviceId', 'DeviceId', 'device_id'])),
      deviceImei: String(get(['deviceImei', 'DeviceImei', 'imei'])),
      deviceUid: String(get(['deviceUid', 'DeviceUid', 'uid'])),
      simPhoneNumber: String(get(['simPhoneNumber', 'SimPhoneNumber', 'sim_number'])),
      fkSimOperator: toNumber(get(['fkSimOperator', 'SimOperatorId', 'sim_operator_id']), 0),
      simSecPhoneNumber: String(get(['simSecPhoneNumber', 'SimSecPhoneNumber', 'sec_sim_number'])),
      fkSecSimOperator: toNumber(get(['fkSecSimOperator', 'SecSimOperatorId', 'sec_sim_operator_id']), 1),
      fkDeviceType: toNumber(get(['fkDeviceType', 'DeviceTypeId', 'device_type_id']), 0),
      fkVehicleType: toNumber(get(['fkVehicleType', 'VehicleTypeId', 'vehicle_type_id']), 0),
      vehicleNo: String(get(['vehicleNo', 'VehicleNo', 'vehicle_number'])),
      nextRecharge: String(nextRecharge || ''),
      description: String(get(['description', 'Description'])),
      installationOn: installationDate,
      lastUpdateOn: new Date().toISOString(),
      creationTime: new Date().toISOString(),
      attributes: JSON.stringify({ nextRecharge: String(nextRecharge || '') }),
    };
  }

  private parseSheetRows(worksheet: XLSX.WorkSheet): any[] {
    const matrix: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    if (!matrix?.length) return [];

    const normalize = (value: any) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const target = this.sampleColumns.map((h) => normalize(h));

    // Find header row dynamically (first 10 rows): row with max matching expected headers
    let headerRowIndex = -1;
    let headerIndexes: number[] = [];
    let maxMatches = 0;
    const scanLimit = Math.min(matrix.length, 10);

    for (let r = 0; r < scanLimit; r++) {
      const row = matrix[r] || [];
      const normalizedHeaders = row.map((h: any) => normalize(h));
      const indexMap = target.map((t) => normalizedHeaders.indexOf(t));
      const matches = indexMap.filter((i) => i >= 0).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        headerRowIndex = r;
        headerIndexes = indexMap;
      }
    }

    // Require minimum header confidence
    if (headerRowIndex === -1 || maxMatches < 4) {
      return [];
    }

    const rows: any[] = [];
    for (let r = headerRowIndex + 1; r < matrix.length; r++) {
      const source = matrix[r] || [];
      const rowObj: any = {};
      let hasAnyValue = false;

      this.sampleColumns.forEach((col, i) => {
        const idx = headerIndexes[i];
        const value = idx >= 0 ? source[idx] : '';
        rowObj[col] = value;
        if (String(value ?? '').trim() !== '') hasAnyValue = true;
      });

      if (hasAnyValue) rows.push(rowObj);
    }
    return rows;
  }

  private createResultRow(row: any) {
    const payload = this.createPayload(row);
    return {
      ...payload,
      entry_status_message: '',
    };
  }

  private formatExcelDate(value: any): string {
    if (!value) return new Date().toISOString().slice(0, 10);
    if (typeof value === 'number') {
      const parsed = XLSX.SSF.parse_date_code(value);
      if (parsed) {
        const y = parsed.y;
        const m = String(parsed.m).padStart(2, '0');
        const d = String(parsed.d).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }
    }
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }
    const str = String(value).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
    const dt = new Date(str);
    if (!Number.isNaN(dt.getTime())) return dt.toISOString().slice(0, 10);
    return new Date().toISOString().slice(0, 10);
  }

}
