import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { filter, tap } from 'rxjs';

import { ITEM_DELETED_EVENT } from 'app/config';
import { Alert, AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { TaskDeleteDialog } from '../delete/task-delete-dialog';
import { ITask } from '../task.model';

@Component({
  selector: 'jhi-task-detail',
  templateUrl: './task-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, RouterLink],
})
export class TaskDetail {
  readonly task = input<ITask | null>(null);
  private readonly modalService = inject(NgbModal);
  private readonly router = inject(Router);

  previousState(): void {
    globalThis.history.back();
  }

  delete(task: ITask): void {
    const modalRef = this.modalService.open(TaskDeleteDialog, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.task = task;
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => void this.router.navigate(['/task'])),
      )
      .subscribe();
  }
}
