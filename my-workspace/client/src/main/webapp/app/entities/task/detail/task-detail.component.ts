import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { ITask } from '../task.model';

@Component({
  selector: 'jhi-task-detail',
  templateUrl: './task-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class TaskDetailComponent {
  task = input<ITask | null>(null);

  previousState(): void {
    window.history.back();
  }
}
