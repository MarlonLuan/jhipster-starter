import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FormatMediumDatetimePipe } from 'app/shared/date';
import SharedModule from 'app/shared/shared.module';
import { IJobHistory } from '../job-history.model';

@Component({
  selector: 'jhi-job-history-detail',
  templateUrl: './job-history-detail.html',
  imports: [SharedModule, RouterLink, FormatMediumDatetimePipe],
})
export class JobHistoryDetail {
  jobHistory = input<IJobHistory | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
