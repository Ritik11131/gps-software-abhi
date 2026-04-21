import { Component, OnDestroy } from '@angular/core';
import { DeviceManageService } from '../../service/device-manage.service';
import * as XLSX from 'xlsx';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-device-bulk-upload',
  templateUrl: './device-bulk-upload.component.html',
  styleUrls: ['./device-bulk-upload.component.scss']
})
export class DeviceBulkUploadComponent implements OnDestroy {
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
  requestId: string = '';
  isPolling: boolean = false;
  pollingTimer: any = null;
  pollingIntervalMs: number = 5000; // Poll every 5 seconds

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

  ngOnDestroy() {
    this.stopPolling();
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
      { key: 'installationOn', title: 'Installation Date' },
      { key: 'expiryDate', title: 'Expiry Date' },
      { key: 'status', title: 'Status' },
      { key: 'errorMessage', title: 'Error' },
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
   * Then starts polling for status using the returned requestId
   */
  getBulkDeviceList() {
    if (!this.selectedFile) {
      this.notificationService.showError('No file selected to upload');
      return;
    }

    this.stopPolling();
    this.spinnerLoading = true;
    this.uploadResult = null;
    this.requestId = '';

    this.deviceManageService.bulkUploadNewApi(this.selectedFile).subscribe((res: any) => {
      this.spinnerLoading = false;

      if (res?.status === 200 || res?.status === 201) {
        const body = res?.body;
        this.uploadResult = body;

        // Response format: {"requestId":"...","count":1}
        if (body?.requestId) {
          this.requestId = body.requestId;
          const count = body?.count || 0;
          this.notificationService.showSuccess(`File uploaded successfully. ${count} device(s) queued for processing...`);
          this.startPolling();
        } else if (body?.result === true) {
          this.notificationService.showSuccess(body?.message || 'File uploaded successfully.');
          const extractedRequestId = this.extractRequestId(body);
          if (extractedRequestId) {
            this.requestId = extractedRequestId;
            this.startPolling();
          }
        } else {
          const errorMsg = body?.message || body?.data || 'Upload failed';
          this.notificationService.showError(errorMsg);
        }
      } else {
        const errorMsg = res?.error?.message || res?.error?.data || res?.message || 'Bulk upload failed';
        this.notificationService.showError(errorMsg);
      }
    }, (err: any) => {
      this.spinnerLoading = false;
      const errorMsg = err?.error?.message || err?.error?.data || err?.message || 'Bulk upload failed';
      this.notificationService.showError(errorMsg);
    });
  }

  /**
   * Extract requestId from various possible response shapes
   */
  private extractRequestId(body: any): string | null {
    // Direct requestId field
    if (body?.requestId) return body.requestId;
    // Nested in data
    if (body?.data?.requestId) return body.data.requestId;
    // data is an array with requestId
    if (Array.isArray(body?.data) && body.data.length > 0 && body.data[0]?.requestId) {
      return body.data[0].requestId;
    }
    // data is a string (requestId itself)
    if (typeof body?.data === 'string' && body.data.length > 10) return body.data;
    return null;
  }

  /**
   * Start polling the status endpoint
   */
  startPolling() {
    if (this.isPolling || !this.requestId) return;
    this.isPolling = true;
    this.pollStatus();
  }

  /**
   * Stop polling
   */
  stopPolling() {
    this.isPolling = false;
    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer);
      this.pollingTimer = null;
    }
  }

  /**
   * Poll the status endpoint and update the table
   */
  private pollStatus() {
    if (!this.isPolling || !this.requestId) return;

    this.deviceManageService.getBulkUploadStatus(this.requestId).subscribe((res: any) => {
      if (res?.status === 200 && res?.body?.result === true) {
        const statusData: any[] = res.body.data || [];
        this.updateTableFromStatus(statusData);

        // Check if all items are processed (not PENDING)
        const hasPending = statusData.some((item: any) => item.status === 'PENDING');
        if (hasPending) {
          // Continue polling
          this.pollingTimer = setTimeout(() => this.pollStatus(), this.pollingIntervalMs);
        } else {
          // All done
          this.isPolling = false;
          const failedCount = statusData.filter((item: any) =>
            item.status !== 'SUCCESS' && item.status !== 'COMPLETED'
          ).length;
          const successCount = statusData.length - failedCount;

          if (failedCount === 0) {
            this.notificationService.showSuccess(`All ${successCount} devices processed successfully`);
          } else {
            this.notificationService.showError(`${failedCount} failed, ${successCount} succeeded`);
          }
        }
      } else {
        // Error polling, retry after delay
        this.pollingTimer = setTimeout(() => this.pollStatus(), this.pollingIntervalMs);
      }
    }, (err: any) => {
      // Error polling, retry after delay
      this.pollingTimer = setTimeout(() => this.pollStatus(), this.pollingIntervalMs);
    });
  }

  /**
   * Update the table data from the polling status response
   */
  private updateTableFromStatus(statusData: any[]) {
    // Replace the table data with the API response data
    this.bulkDeviceData = statusData.map((item: any) => ({
      deviceId: item.deviceId || '',
      deviceImei: item.imei || '',
      deviceUid: item.deviceUid || '',
      simPhoneNumber: item.primaryPhoneNumber || '',
      fkSimOperator: item.primaryPhoneOperator || '',
      simSecPhoneNumber: item.secondaryPhoneNumber || '',
      fkSecSimOperator: item.secondaryPhoneOperator || '',
      fkDeviceType: item.deviceType || '',
      fkVehicleType: item.vehicleType || '',
      vehicleNo: item.vehicleNo || '',
      installationOn: item.installationOn ? new Date(item.installationOn).toLocaleDateString() : '',
      expiryDate: item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '',
      status: item.status || 'PENDING',
      errorMessage: item.errorMessage || '',
    }));
    this.count = this.bulkDeviceData.length;
  }

  private previewSelectedFile() {
    if (!this.selectedFile) return;
    this.bulkDeviceData = [];
    this.parsedRows = [];
    this.count = 0;
    this.uploadResult = null;
    this.requestId = '';
    this.stopPolling();

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
    this.stopPolling();
    this.selectedFile = null;
    this.selectedFileName = '';
    this.bulkDeviceData = [];
    this.parsedRows = [];
    this.count = 0;
    this.uploadResult = null;
    this.requestId = '';
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
    const get = (keys: string[]) => {
      for (const key of keys) {
        if (row?.[key] !== undefined && row?.[key] !== null && row?.[key] !== '') return row[key];
      }
      return '';
    };

    return {
      deviceId: String(get(['deviceId', 'DeviceId', 'device_id'])),
      deviceImei: String(get(['deviceImei', 'DeviceImei', 'imei'])),
      deviceUid: String(get(['deviceUid', 'DeviceUid', 'uid'])),
      simPhoneNumber: String(get(['simPhoneNumber', 'SimPhoneNumber', 'sim_number'])),
      fkSimOperator: String(get(['fkSimOperator', 'SimOperatorId', 'sim_operator_id'])),
      simSecPhoneNumber: String(get(['simSecPhoneNumber', 'SimSecPhoneNumber', 'sec_sim_number'])),
      fkSecSimOperator: String(get(['fkSecSimOperator', 'SecSimOperatorId', 'sec_sim_operator_id'])),
      fkDeviceType: String(get(['fkDeviceType', 'DeviceTypeId', 'device_type_id'])),
      fkVehicleType: String(get(['fkVehicleType', 'VehicleTypeId', 'vehicle_type_id'])),
      vehicleNo: String(get(['vehicleNo', 'VehicleNo', 'vehicle_number'])),
      installationOn: String(get(['installationOn', 'InstallationOn', 'installation_date'])),
      expiryDate: String(get(['nextRecharge', 'NextRecharge', 'expiryDate'])),
      status: 'Pending',
      errorMessage: '',
    };
  }
}
