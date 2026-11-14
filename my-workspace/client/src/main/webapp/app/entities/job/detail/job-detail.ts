import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { filter, tap } from 'rxjs';

import { ITEM_DELETED_EVENT } from 'app/config';
import { Alert, AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { JobDeleteDialog } from '../delete/job-delete-dialog';
import { IJob } from '../job.model';

@Component({
  selector: 'jhi-job-detail',
  templateUrl: './job-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, RouterLink],
})
export class JobDetail {
  readonly job = input<IJob | null>(null);
  private readonly modalService = inject(NgbModal);
  private readonly router = inject(Router);

  previousState(): void {
    globalThis.history.back();
  }

  delete(job: IJob): void {
    const modalRef = this.modalService.open(JobDeleteDialog, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.job = job;
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => void this.router.navigate(['/job'])),
      )
      .subscribe();
  }
}
