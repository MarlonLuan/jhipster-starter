import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, tap } from 'rxjs';

import { ITEM_DELETED_EVENT } from 'app/config';
import { Alert, AlertError } from 'app/shared/alert';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { TranslateDirective } from 'app/shared/language';
import { EmployeeDeleteDialog } from '../delete/employee-delete-dialog';
import { IEmployee } from '../employee.model';

@Component({
  selector: 'jhi-employee-detail',
  templateUrl: './employee-detail.html',
  imports: [FontAwesomeModule, NgbTooltip, Alert, AlertError, TranslateDirective, TranslatePipe, RouterLink, FormatMediumDatetimePipe],
})
export class EmployeeDetail {
  readonly employee = input<IEmployee | null>(null);
  private readonly modalService = inject(NgbModal);
  private readonly router = inject(Router);

  previousState(): void {
    globalThis.history.back();
  }

  delete(employee: IEmployee): void {
    const modalRef = this.modalService.open(EmployeeDeleteDialog, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.employee = employee;
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => void this.router.navigate(['/employee'])),
      )
      .subscribe();
  }
}
