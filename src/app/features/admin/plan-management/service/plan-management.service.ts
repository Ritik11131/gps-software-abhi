import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from 'src/app/features/http-services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PlanManagementService {

  constructor(
    private apiService: ApiService
  ) { }

  // ── Plans ─────────────────────────────────────────

  getPlanList(): Observable<any> {
    return this.apiService
      .get('Billing/CustomerPlan')
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  createPlan(payload: any): Observable<any> {
    return this.apiService
      .post('Billing/CustomerPlan', payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  updatePlan(id: number, payload: any): Observable<any> {
    return this.apiService
      .put(`Billing/CustomerPlan/${id}`, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  deletePlan(id: number): Observable<any> {
    return this.apiService
      .delete(`Billing/CustomerPlan/${id}`)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // ── Sub Plans (Durations) ─────────────────────────

  getSubPlanList(planId: number): Observable<any> {
    return this.apiService
      .get(`Billing/CustomerPlanDuration/${planId}`)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  createSubPlan(payload: any): Observable<any> {
    return this.apiService
      .post('Billing/CustomerPlanDuration', payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  updateSubPlan(id: number, payload: any): Observable<any> {
    return this.apiService
      .put(`Billing/CustomerPlanDuration/${id}`, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  deleteSubPlan(id: number): Observable<any> {
    return this.apiService
      .delete(`Billing/CustomerPlanDuration/${id}`)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
}
