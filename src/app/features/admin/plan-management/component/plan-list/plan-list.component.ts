import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PlanManagementService } from '../../service/plan-management.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss']
})
export class PlanListComponent implements OnInit {

  @ViewChild('planModal') planModal!: TemplateRef<any>;
  @ViewChild('deletePlanModal') deletePlanModal!: TemplateRef<any>;
  @ViewChild('subPlanModal') subPlanModal!: TemplateRef<any>;
  @ViewChild('deleteSubPlanModal') deleteSubPlanModal!: TemplateRef<any>;

  planList: any[] = [];
  isLoading = false;
  searchText = '';

  // Pagination
  page = 1;
  count = 0;
  tableSize = 10;

  // Modal ref
  bsModalRef!: BsModalRef;

  // Create / Edit plan
  isEditMode = false;
  editingPlan: any = null;
  planName = '';
  isSaving = false;

  // Delete plan
  deletingPlan: any = null;
  isDeleting = false;

  // Sub-plan expansion
  expandedPlanId: number | null = null;
  subPlanList: any[] = [];
  isLoadingSubPlans = false;

  // Sub-plan create/edit
  isSubPlanEditMode = false;
  editingSubPlan: any = null;
  subPlanForm = {
    name: '',
    duration: '',
    durationUnit: 'days',
    amount: '',
    tax: '',
    platformFee: ''
  };
  isSavingSubPlan = false;

  // Sub-plan delete
  deletingSubPlan: any = null;
  isDeletingSubPlan = false;

  constructor(
    private planService: PlanManagementService,
    private notificationService: NotificationService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.loadPlans();
  }

  // ── Plan CRUD ─────────────────────────────────────

  loadPlans(): void {
    this.isLoading = true;
    this.planService.getPlanList().subscribe((res: any) => {
      this.isLoading = false;
      if (res?.body?.data) {
        this.planList = res.body.data;
      } else if (Array.isArray(res?.body)) {
        this.planList = res.body;
      } else {
        this.planList = [];
      }
      this.count = this.planList.length;
    }, () => {
      this.isLoading = false;
      this.planList = [];
    });
  }

  get filteredPlans(): any[] {
    if (!this.searchText.trim()) return this.planList;
    const q = this.searchText.toLowerCase();
    return this.planList.filter((p: any) =>
      p.planName?.toLowerCase().includes(q)
    );
  }

  onTableDataChange(event: number): void {
    this.page = event;
  }

  // ── Plan Modal ────────────────────────────────────

  openCreatePlanModal(): void {
    this.isEditMode = false;
    this.editingPlan = null;
    this.planName = '';
    this.bsModalRef = this.modalService.show(this.planModal, {
      class: 'modal-md modal-dialog-centered'
    });
  }

  openEditPlanModal(plan: any): void {
    this.isEditMode = true;
    this.editingPlan = plan;
    this.planName = plan.planName;
    this.bsModalRef = this.modalService.show(this.planModal, {
      class: 'modal-md modal-dialog-centered'
    });
  }

  closePlanModal(): void {
    this.bsModalRef?.hide();
    this.planName = '';
    this.editingPlan = null;
  }

  savePlan(): void {
    if (!this.planName.trim()) return;
    this.isSaving = true;

    if (this.isEditMode && this.editingPlan) {
      const payload = {
        id: this.editingPlan.id,
        userId: this.editingPlan.userId,
        planName: this.planName.trim(),
        creationTime: this.editingPlan.creationTime,
        lastUpdateTime: new Date().toISOString()
      };
      this.planService.updatePlan(this.editingPlan.id, payload).subscribe((res: any) => {
        this.isSaving = false;
        if (res?.body?.result || res?.status === 200) {
          this.notificationService.showSuccess('Plan updated successfully');
          this.closePlanModal();
          this.loadPlans();
        } else {
          this.notificationService.showError(res?.body?.message || 'Failed to update plan');
        }
      }, () => {
        this.isSaving = false;
        this.notificationService.showError('Failed to update plan');
      });
    } else {
      const payload = { PlanName: this.planName.trim() };
      this.planService.createPlan(payload).subscribe((res: any) => {
        this.isSaving = false;
        if (res?.body?.id || res?.status === 200 || res?.status === 201) {
          this.notificationService.showSuccess('Plan created successfully');
          this.closePlanModal();
          this.loadPlans();
        } else {
          this.notificationService.showError(res?.body?.message || 'Failed to create plan');
        }
      }, () => {
        this.isSaving = false;
        this.notificationService.showError('Failed to create plan');
      });
    }
  }

  // ── Delete Plan ───────────────────────────────────

  openDeletePlanModal(plan: any): void {
    this.deletingPlan = plan;
    this.bsModalRef = this.modalService.show(this.deletePlanModal, {
      class: 'modal-md modal-dialog-centered'
    });
  }

  closeDeleteModal(): void {
    this.bsModalRef?.hide();
    this.deletingPlan = null;
  }

  confirmDeletePlan(): void {
    if (!this.deletingPlan) return;
    this.isDeleting = true;
    this.planService.deletePlan(this.deletingPlan.id).subscribe((res: any) => {
      this.isDeleting = false;
      if (res?.status === 204 || res?.status === 200) {
        this.notificationService.showSuccess('Plan deleted successfully');
        if (this.expandedPlanId === this.deletingPlan.id) {
          this.expandedPlanId = null;
          this.subPlanList = [];
        }
        this.closeDeleteModal();
        this.loadPlans();
      } else {
        this.notificationService.showError('Failed to delete plan');
      }
    }, () => {
      this.isDeleting = false;
      this.notificationService.showError('Failed to delete plan');
    });
  }

  // ── Sub-Plan Expansion ────────────────────────────

  toggleSubPlans(plan: any): void {
    if (this.expandedPlanId === plan.id) {
      this.expandedPlanId = null;
      this.subPlanList = [];
      return;
    }
    this.expandedPlanId = plan.id;
    this.loadSubPlans(plan.id);
  }

  loadSubPlans(planId: number): void {
    this.isLoadingSubPlans = true;
    this.subPlanList = [];
    this.planService.getSubPlanList(planId).subscribe((res: any) => {
      if (res?.body?.data && Array.isArray(res.body.data)) {
        this.subPlanList = res.body.data.map((item: any) => item.durations || item);
      } else if (Array.isArray(res?.body)) {
        this.subPlanList = res.body;
      }
      this.isLoadingSubPlans = false;
    }, () => {
      this.isLoadingSubPlans = false;
    });
  }

  getExpandedPlanName(): string {
    const plan = this.planList.find((p: any) => p.id === this.expandedPlanId);
    return plan?.planName || '';
  }

  // ── Sub-Plan CRUD ─────────────────────────────────

  openCreateSubPlanModal(): void {
    this.isSubPlanEditMode = false;
    this.editingSubPlan = null;
    this.subPlanForm = {
      name: '', duration: '', durationUnit: 'days',
      amount: '', tax: '', platformFee: ''
    };
    this.bsModalRef = this.modalService.show(this.subPlanModal, {
      class: 'modal-lg modal-dialog-centered'
    });
  }

  openEditSubPlanModal(subPlan: any): void {
    this.isSubPlanEditMode = true;
    this.editingSubPlan = subPlan;
    this.subPlanForm = {
      name: subPlan.name || '',
      duration: subPlan.duration?.toString() || '',
      durationUnit: subPlan.durationUnit || 'days',
      amount: subPlan.amount?.toString() || '',
      tax: subPlan.tax?.toString() || '',
      platformFee: subPlan.platformFee?.toString() || ''
    };
    this.bsModalRef = this.modalService.show(this.subPlanModal, {
      class: 'modal-lg modal-dialog-centered'
    });
  }

  closeSubPlanModal(): void {
    this.bsModalRef?.hide();
    this.editingSubPlan = null;
  }

  saveSubPlan(): void {
    if (!this.subPlanForm.name.trim() || !this.subPlanForm.duration || !this.subPlanForm.amount) return;
    this.isSavingSubPlan = true;

    if (this.isSubPlanEditMode && this.editingSubPlan) {
      const payload = {
        id: this.editingSubPlan.id,
        planId: this.expandedPlanId,
        name: this.subPlanForm.name.trim(),
        duration: Number(this.subPlanForm.duration),
        DurationUnit: this.subPlanForm.durationUnit,
        amount: Number(this.subPlanForm.amount),
        tax: Number(this.subPlanForm.tax) || 0,
        platformFee: Number(this.subPlanForm.platformFee) || 0,
        creationTime: this.editingSubPlan.creationTime,
        lastUpdateTime: new Date().toISOString()
      };
      this.planService.updateSubPlan(this.editingSubPlan.id, payload).subscribe((res: any) => {
        this.isSavingSubPlan = false;
        if (res?.body?.result || res?.status === 200) {
          this.notificationService.showSuccess('Sub plan updated successfully');
          this.closeSubPlanModal();
          this.loadSubPlans(this.expandedPlanId!);
        } else {
          this.notificationService.showError(res?.body?.message || 'Failed to update sub plan');
        }
      }, () => {
        this.isSavingSubPlan = false;
        this.notificationService.showError('Failed to update sub plan');
      });
    } else {
      const payload = {
        planId: this.expandedPlanId,
        name: this.subPlanForm.name.trim(),
        duration: this.subPlanForm.duration,
        DurationUnit: this.subPlanForm.durationUnit,
        amount: Number(this.subPlanForm.amount),
        tax: Number(this.subPlanForm.tax) || 0,
        platformFee: Number(this.subPlanForm.platformFee) || 0
      };
      this.planService.createSubPlan(payload).subscribe((res: any) => {
        this.isSavingSubPlan = false;
        if (res?.body?.id || res?.status === 200 || res?.status === 201) {
          this.notificationService.showSuccess('Sub plan created successfully');
          this.closeSubPlanModal();
          this.loadSubPlans(this.expandedPlanId!);
        } else {
          this.notificationService.showError(res?.body?.message || 'Failed to create sub plan');
        }
      }, () => {
        this.isSavingSubPlan = false;
        this.notificationService.showError('Failed to create sub plan');
      });
    }
  }

  // ── Delete Sub Plan ───────────────────────────────

  openDeleteSubPlanModal(subPlan: any): void {
    this.deletingSubPlan = subPlan;
    this.bsModalRef = this.modalService.show(this.deleteSubPlanModal, {
      class: 'modal-md modal-dialog-centered'
    });
  }

  closeDeleteSubPlanModal(): void {
    this.bsModalRef?.hide();
    this.deletingSubPlan = null;
  }

  confirmDeleteSubPlan(): void {
    if (!this.deletingSubPlan) return;
    this.isDeletingSubPlan = true;
    this.planService.deleteSubPlan(this.deletingSubPlan.id).subscribe((res: any) => {
      this.isDeletingSubPlan = false;
      if (res?.status === 204 || res?.status === 200) {
        this.notificationService.showSuccess('Sub plan deleted successfully');
        this.closeDeleteSubPlanModal();
        this.loadSubPlans(this.expandedPlanId!);
      } else {
        this.notificationService.showError('Failed to delete sub plan');
      }
    }, () => {
      this.isDeletingSubPlan = false;
      this.notificationService.showError('Failed to delete sub plan');
    });
  }
}
