import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { Alert } from 'app/shared/alert/alert';
import { AlertError } from 'app/shared/alert/alert-error';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { TranslateDirective } from 'app/shared/language';
import { IJobHistory } from '../job-history.model';

@Component({
  selector: 'jhi-job-history-detail',
  templateUrl: './job-history-detail.html',
  imports: [FontAwesomeModule, NgbModule, Alert, AlertError, TranslateDirective, TranslateModule, RouterLink, FormatMediumDatetimePipe],
})
export class JobHistoryDetail {
  jobHistory = input<IJobHistory | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
