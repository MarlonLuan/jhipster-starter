import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Alert, AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { IJob } from '../job.model';

@Component({
  selector: 'jhi-job-detail',
  templateUrl: './job-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, RouterLink],
})
export class JobDetail {
  readonly job = input<IJob | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
