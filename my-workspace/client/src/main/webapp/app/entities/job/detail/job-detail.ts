import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IJob } from '../job.model';

@Component({
  selector: 'jhi-job-detail',
  templateUrl: './job-detail.html',
  imports: [SharedModule, RouterLink],
})
export class JobDetail {
  job = input<IJob | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
