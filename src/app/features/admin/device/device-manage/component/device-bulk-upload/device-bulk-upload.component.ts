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
  uploadResult: any = null;
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

  /**
   * Downloads the sample Excel file from the API (GET /api/BulkUpload)
   */
  downloadExcel() {
    this.spinnerLoading = true;
    this.deviceManageService.downloadBulkUploadSample().subscribe((res: any) => {
      this.spinnerLoading = false;
      if (res?.status === 200 && res?.body) {
        const blob = res.body;
        // Extract filename from Content-Disposition header, fallback to default
        let filename = 'device_upload_sample.xlsx';
        const contentDisposition = res.headers?.get('Content-Disposition');
        if (contentDisposition) {
          const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (match && match[1]) {
            filename = match[1].replace(/['"]/g, '');
          }
        }
        // Trigger browser download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.notificationService.showSuccess('Sample file downloaded successfully');
      } else {
        this.notificationService.showError('Failed to download sample file');
      }
    }, (err: any) => {
      this.spinnerLoading = false;
      this.notificationService.showError('Failed to download sample file');
    });
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

  /**
   * Uploads the selected file to the API (POST /api/BulkUpload)
   */
  getBulkDeviceList() {
    if (!this.selectedFile) {
      this.notificationService.showError('No file selected to upload');
      return;
    }
    this.spinnerLoading = true;
    this.uploadResult = null;
    // Reset result column
    this.bulkDeviceData.forEach((row) => row.entry_status_message = 'Uploading...');

    this.deviceManageService.bulkUploadNewApi(this.selectedFile).subscribe((res: any) => {
      this.spinnerLoading = false;
      if (res?.status === 200 || res?.status === 201) {
        const body = res?.body;
        this.uploadResult = body;

        if (body?.result === true) {
          this.notificationService.showSuccess(body?.message || 'Bulk upload completed successfully');
          // Mark all rows as success
          this.bulkDeviceData.forEach((row) => row.entry_status_message = 'Success');

          // If the API returns detailed per-row results, update accordingly
          if (body?.data && Array.isArray(body.data)) {
            this.handleDetailedResults(body.data);
          }
        } else {
          // Partial failure or error
          const errorMsg = body?.message || body?.data || 'Upload completed with errors';
          this.notificationService.showError(errorMsg);
          this.bulkDeviceData.forEach((row) => row.entry_status_message = errorMsg);

          if (body?.data && Array.isArray(body.data)) {
            this.handleDetailedResults(body.data);
          }
        }
      } else {
        const errorMsg = res?.error?.message || res?.error?.data || res?.message || 'Bulk upload failed';
        this.notificationService.showError(errorMsg);
        this.bulkDeviceData.forEach((row) => row.entry_status_message = 'Failed');
      }
    }, (err: any) => {
      this.spinnerLoading = false;
      const errorMsg = err?.error?.message || err?.error?.data || err?.message || 'Bulk upload failed';
      this.notificationService.showError(errorMsg);
      this.bulkDeviceData.forEach((row) => row.entry_status_message = 'Failed');
    });
  }

  /**
   * Handle detailed per-row results from the API response
   */
  private handleDetailedResults(results: any[]) {
    results.forEach((result: any, index: number) => {
      if (index < this.bulkDeviceData.length) {
        if (result?.result === true || result?.status === 'Success' || result?.success === true) {
          this.bulkDeviceData[index].entry_status_message = 'Success';
        } else {
          this.bulkDeviceData[index].entry_status_message = result?.message || result?.error || 'Failed';
        }
      }
    });
  }

  private previewSelectedFile() {
    if (!this.selectedFile) return;
    this.bulkDeviceData = [];
    this.parsedRows = [];
    this.count = 0;
    this.uploadResult = null;

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
    this.uploadResult = null;
    // Reset file input
    const fileInput = document.getElementById('excelFileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  /**
  * table data change
  * @param event 
  */
  onTableDataChange(event: any) {
    this.page = event;
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
