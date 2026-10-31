import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { filter, tap } from 'rxjs';

import { ITEM_DELETED_EVENT } from 'app/config';
import { Alert, AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { DepartmentDeleteDialog } from '../delete/department-delete-dialog';
import { IDepartment } from '../department.model';

@Component({
  selector: 'jhi-department-detail',
  templateUrl: './department-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, RouterLink],
})
export class DepartmentDetail {
  readonly department = input<IDepartment | null>(null);
  private readonly modalService = inject(NgbModal);
  private readonly router = inject(Router);

  previousState(): void {
    globalThis.history.back();
  }

  delete(department: IDepartment): void {
    const modalRef = this.modalService.open(DepartmentDeleteDialog, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.department = department;
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => void this.router.navigate(['/department'])),
      )
      .subscribe();
  }
}
