import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { Alert } from 'app/shared/alert/alert';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { ITask } from '../task.model';

@Component({
  selector: 'jhi-task-detail',
  templateUrl: './task-detail.html',
  imports: [FontAwesomeModule, NgbModule, Alert, AlertError, TranslateDirective, TranslateModule, RouterLink],
})
export class TaskDetail {
  task = input<ITask | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
