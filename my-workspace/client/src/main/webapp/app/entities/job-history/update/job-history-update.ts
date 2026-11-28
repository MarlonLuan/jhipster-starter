import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormField, FormRoot, TreeValidationResult } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, map, tap } from 'rxjs';

import { IDepartment } from 'app/entities/department/department.model';
import { DepartmentService } from 'app/entities/department/service/department.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { Language } from 'app/entities/enumerations/language.model';
import { IJob } from 'app/entities/job/job.model';
import { JobService } from 'app/entities/job/service/job.service';
import { AlertError } from 'app/shared/alert';
import { SelectOptionsDirective, ServerError, toSubmissionResult } from 'app/shared/form';
import { TranslateDirective } from 'app/shared/language';
import { IJobHistory } from '../job-history.model';
import { JobHistoryService } from '../service/job-history.service';

import { JobHistoryFormService } from './job-history-form.service';

@Component({
  selector: 'jhi-job-history-update',
  templateUrl: './job-history-update.html',
  imports: [TranslateDirective, TranslatePipe, FontAwesomeModule, AlertError, FormField, FormRoot, SelectOptionsDirective, ServerError],
})
export class JobHistoryUpdate implements OnInit {
  readonly isSaving = signal(false);
  jobHistory: IJobHistory | null = null;
  languageValues = Object.keys(Language);

  jobsSharedCollection = signal<IJob[]>([]);
  departmentsSharedCollection = signal<IDepartment[]>([]);
  employeesSharedCollection = signal<IEmployee[]>([]);

  private readonly jobHistoryService = inject(JobHistoryService);
  private readonly jobHistoryFormService = inject(JobHistoryFormService);
  private readonly jobService = inject(JobService);
  private readonly departmentService = inject(DepartmentService);
  private readonly employeeService = inject(EmployeeService);
  private readonly activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly jobHistoryModel = signal(this.jobHistoryFormService.createJobHistoryFormModel());
  // The properties showing the error of the server, which marks them invalid and leaves them out of the alert.
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly serverErrorFields = ['startDate', 'endDate', 'language', 'job', 'department', 'employee'] as const;

  // A submit marks the fields as touched and sends nothing while the form is invalid.
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly editForm = this.jobHistoryFormService.createJobHistoryForm(this.jobHistoryModel, {
    submission: { action: () => this.save() },
  });

  compareJob = (o1: IJob | null, o2: IJob | null): boolean => this.jobService.compareJob(o1, o2);

  compareDepartment = (o1: IDepartment | null, o2: IDepartment | null): boolean => this.departmentService.compareDepartment(o1, o2);

  compareEmployee = (o1: IEmployee | null, o2: IEmployee | null): boolean => this.employeeService.compareEmployee(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobHistory }) => {
      this.jobHistory = jobHistory;
      if (jobHistory) {
        this.updateForm(jobHistory);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): Promise<TreeValidationResult> {
    this.isSaving.set(true);
    const jobHistory = this.jobHistoryFormService.getJobHistory(this.jobHistoryModel());
    if (jobHistory.id === null) {
      return this.subscribeToSaveResponse(this.jobHistoryService.create(jobHistory));
    }
    return this.subscribeToSaveResponse(this.jobHistoryService.update(jobHistory));
  }

  private subscribeToSaveResponse(result: Observable<IJobHistory | null>): Promise<TreeValidationResult> {
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

  private updateForm(jobHistory: IJobHistory): void {
    this.jobHistory = jobHistory;
    this.jobHistoryModel.set(this.jobHistoryFormService.createJobHistoryFormModel(jobHistory));

    this.jobsSharedCollection.update(jobs => this.jobService.addJobToCollectionIfMissing<IJob>(jobs, jobHistory.job));
    this.departmentsSharedCollection.update(departments =>
      this.departmentService.addDepartmentToCollectionIfMissing<IDepartment>(departments, jobHistory.department),
    );
    this.employeesSharedCollection.update(employees =>
      this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(employees, jobHistory.employee),
    );
  }

  private loadRelationshipsOptions(): void {
    this.jobService
      .query()
      .pipe(map((res: HttpResponse<IJob[]>) => res.body ?? []))
      .pipe(map((jobs: IJob[]) => this.jobService.addJobToCollectionIfMissing<IJob>(jobs, this.jobHistory?.job)))
      .subscribe((jobs: IJob[]) => this.jobsSharedCollection.set(jobs));

    this.departmentService
      .query()
      .pipe(map((res: HttpResponse<IDepartment[]>) => res.body ?? []))
      .pipe(
        map((departments: IDepartment[]) =>
          this.departmentService.addDepartmentToCollectionIfMissing<IDepartment>(departments, this.jobHistory?.department),
        ),
      )
      .subscribe((departments: IDepartment[]) => this.departmentsSharedCollection.set(departments));

    this.employeeService
      .query()
      .pipe(map((res: HttpResponse<IEmployee[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployee[]) =>
          this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(employees, this.jobHistory?.employee),
        ),
      )
      .subscribe((employees: IEmployee[]) => this.employeesSharedCollection.set(employees));
  }
}
