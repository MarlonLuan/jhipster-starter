import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormField, FormRoot, TreeValidationResult } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable, map, tap } from 'rxjs';

import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { TaskService } from 'app/entities/task/service/task.service';
import { ITask } from 'app/entities/task/task.model';
import { AlertError } from 'app/shared/alert';
import { SelectOptionsDirective, ServerError, toSubmissionResult } from 'app/shared/form';
import { TranslateDirective } from 'app/shared/language';
import { IJob } from '../job.model';
import { JobService } from '../service/job.service';

import { JobFormService } from './job-form.service';

@Component({
  selector: 'jhi-job-update',
  templateUrl: './job-update.html',
  imports: [TranslateDirective, FontAwesomeModule, AlertError, FormField, FormRoot, SelectOptionsDirective, ServerError],
})
export class JobUpdate implements OnInit {
  readonly isSaving = signal(false);
  job: IJob | null = null;

  tasksSharedCollection = signal<ITask[]>([]);
  employeesSharedCollection = signal<IEmployee[]>([]);

  private readonly jobService = inject(JobService);
  private readonly jobFormService = inject(JobFormService);
  private readonly taskService = inject(TaskService);
  private readonly employeeService = inject(EmployeeService);
  private readonly activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly jobModel = signal(this.jobFormService.createJobFormModel());
  // The properties showing the error of the server, which marks them invalid and leaves them out of the alert.
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly serverErrorFields = ['jobTitle', 'minSalary', 'maxSalary', 'tasks', 'employee'] as const;

  // A submit marks the fields as touched and sends nothing while the form is invalid.
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly editForm = this.jobFormService.createJobForm(this.jobModel, {
    submission: { action: () => this.save() },
  });

  compareTask = (o1: ITask | null, o2: ITask | null): boolean => this.taskService.compareTask(o1, o2);

  compareEmployee = (o1: IEmployee | null, o2: IEmployee | null): boolean => this.employeeService.compareEmployee(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ job }) => {
      this.job = job;
      if (job) {
        this.updateForm(job);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): Promise<TreeValidationResult> {
    this.isSaving.set(true);
    const job = this.jobFormService.getJob(this.jobModel(), this.job);
    if (job.id === null) {
      return this.subscribeToSaveResponse(this.jobService.create(job));
    }
    return this.subscribeToSaveResponse(this.jobService.update(job));
  }

  private subscribeToSaveResponse(result: Observable<IJob | null>): Promise<TreeValidationResult> {
    return toSubmissionResult(
      this.editForm,
      this.serverErrorFields,
      result.pipe(tap({ next: () => this.onSaveSuccess(), error: () => this.onSaveError(), finalize: () => this.onSaveFinalize() })),
    );
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

  private updateForm(job: IJob): void {
    this.job = job;
    this.jobModel.set(this.jobFormService.createJobFormModel(job));

    this.tasksSharedCollection.update(tasks => this.taskService.addTaskToCollectionIfMissing<ITask>(tasks, ...(job.tasks ?? [])));
    this.employeesSharedCollection.update(employees =>
      this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(employees, job.employee),
    );
  }

  private loadRelationshipsOptions(): void {
    this.taskService
      .query()
      .pipe(map((res: HttpResponse<ITask[]>) => res.body ?? []))
      .pipe(map((tasks: ITask[]) => this.taskService.addTaskToCollectionIfMissing<ITask>(tasks, ...(this.job?.tasks ?? []))))
      .subscribe((tasks: ITask[]) => this.tasksSharedCollection.set(tasks));

    this.employeeService
      .query()
      .pipe(map((res: HttpResponse<IEmployee[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployee[]) => this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(employees, this.job?.employee)),
      )
      .subscribe((employees: IEmployee[]) => this.employeesSharedCollection.set(employees));
  }
}
