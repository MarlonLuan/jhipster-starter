import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import SharedModule from 'app/shared/shared.module';
import { IJob } from '../job.model';
import { JobService } from '../service/job.service';

@Component({
  templateUrl: './job-delete-dialog.html',
  imports: [SharedModule, FormsModule],
})
export class JobDeleteDialog {
  job?: IJob;

  protected jobService = inject(JobService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.jobService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
