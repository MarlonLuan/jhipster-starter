import { Component, OnInit, inject, signal } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable, finalize } from 'rxjs';

import { AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { TaskService } from '../service/task.service';
import { ITask } from '../task.model';

import { TaskFormService } from './task-form.service';

@Component({
  selector: 'jhi-task-update',
  templateUrl: './task-update.html',
  imports: [TranslateDirective, FontAwesomeModule, AlertError, FormField, FormRoot],
})
export class TaskUpdate implements OnInit {
  readonly isSaving = signal(false);
  task: ITask | null = null;

  private readonly taskService = inject(TaskService);
  private readonly taskFormService = inject(TaskFormService);
  private readonly activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly taskModel = signal(this.taskFormService.createTaskFormModel());
  // A submit marks the fields as touched and sends nothing while the form is invalid.
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly editForm = this.taskFormService.createTaskForm(this.taskModel, {
    submission: { action: () => Promise.resolve(this.save()) },
  });

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ task }) => {
      this.task = task;
      if (task) {
        this.updateForm(task);
      }
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const task = this.taskFormService.getTask(this.taskModel());
    if (task.id === null) {
      this.subscribeToSaveResponse(this.taskService.create(task));
    } else {
      this.subscribeToSaveResponse(this.taskService.update(task));
    }
  }

  private subscribeToSaveResponse(result: Observable<ITask | null>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  private onSaveSuccess(): void {
    this.previousState();
  }

  private onSaveError(): void {
    // API for inheritance.
  }

  private onSaveFinalize(): void {
    this.isSaving.set(false);
  }

  private updateForm(task: ITask): void {
    this.task = task;
    this.taskModel.set(this.taskFormService.createTaskFormModel(task));
  }
}
