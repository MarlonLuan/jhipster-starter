import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { ITask } from '../task.model';

@Component({
  selector: 'jhi-task-detail',
  templateUrl: './task-detail.html',
  imports: [SharedModule, RouterLink],
})
export class TaskDetail {
  task = input<ITask | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
