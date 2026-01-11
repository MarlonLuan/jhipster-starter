import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import SharedModule from 'app/shared/shared.module';
import { TaskService } from '../service/task.service';
import { ITask } from '../task.model';

@Component({
  templateUrl: './task-delete-dialog.html',
  imports: [SharedModule, FormsModule],
})
export class TaskDeleteDialog {
  task?: ITask;

  protected taskService = inject(TaskService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.taskService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
