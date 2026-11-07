import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { filter, tap } from 'rxjs';

import { ITEM_DELETED_EVENT } from 'app/config';
import { Alert, AlertError } from 'app/shared/alert';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { TranslateDirective } from 'app/shared/language';
import { JobHistoryDeleteDialog } from '../delete/job-history-delete-dialog';
import { IJobHistory } from '../job-history.model';

@Component({
  selector: 'jhi-job-history-detail',
  templateUrl: './job-history-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, RouterLink, FormatMediumDatetimePipe],
})
export class JobHistoryDetail {
  readonly jobHistory = input<IJobHistory | null>(null);
  private readonly modalService = inject(NgbModal);
  private readonly router = inject(Router);

  previousState(): void {
    globalThis.history.back();
  }

  delete(jobHistory: IJobHistory): void {
    const modalRef = this.modalService.open(JobHistoryDeleteDialog, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.jobHistory = jobHistory;
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => void this.router.navigate(['/job-history'])),
      )
      .subscribe();
  }
}
