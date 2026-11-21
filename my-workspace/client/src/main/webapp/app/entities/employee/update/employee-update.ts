import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, finalize, map } from 'rxjs';

import { IDepartment } from 'app/entities/department/department.model';
import { DepartmentService } from 'app/entities/department/service/department.service';
import { AlertError } from 'app/shared/alert';
import { SelectOptionsDirective } from 'app/shared/form';
import { TranslateDirective } from 'app/shared/language';
import { IEmployee } from '../employee.model';
import { EmployeeService } from '../service/employee.service';

import { EmployeeFormService } from './employee-form.service';

@Component({
  selector: 'jhi-employee-update',
  templateUrl: './employee-update.html',
  imports: [TranslateDirective, TranslatePipe, FontAwesomeModule, AlertError, FormField, FormRoot, SelectOptionsDirective, NgbTooltip],
})
export class EmployeeUpdate implements OnInit {
  readonly isSaving = signal(false);
  employee: IEmployee | null = null;

  employeesSharedCollection = signal<IEmployee[]>([]);
  departmentsSharedCollection = signal<IDepartment[]>([]);

  private readonly employeeService = inject(EmployeeService);
  private readonly employeeFormService = inject(EmployeeFormService);
  private readonly departmentService = inject(DepartmentService);
  private readonly activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly employeeModel = signal(this.employeeFormService.createEmployeeFormModel());
  // A submit marks the fields as touched and sends nothing while the form is invalid.
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly editForm = this.employeeFormService.createEmployeeForm(this.employeeModel, {
    submission: { action: () => Promise.resolve(this.save()) },
  });

  compareEmployee = (o1: IEmployee | null, o2: IEmployee | null): boolean => this.employeeService.compareEmployee(o1, o2);

  compareDepartment = (o1: IDepartment | null, o2: IDepartment | null): boolean => this.departmentService.compareDepartment(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ employee }) => {
      this.employee = employee;
      if (employee) {
        this.updateForm(employee);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const employee = this.employeeFormService.getEmployee(this.employeeModel());
    if (employee.id === null) {
      this.subscribeToSaveResponse(this.employeeService.create(employee));
    } else {
      this.subscribeToSaveResponse(this.employeeService.update(employee));
    }
  }

  private subscribeToSaveResponse(result: Observable<IEmployee | null>): void {
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

  private updateForm(employee: IEmployee): void {
    this.employee = employee;
    this.employeeModel.set(this.employeeFormService.createEmployeeFormModel(employee));

    this.employeesSharedCollection.update(employees =>
      this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(employees, employee.manager),
    );
    this.departmentsSharedCollection.update(departments =>
      this.departmentService.addDepartmentToCollectionIfMissing<IDepartment>(departments, employee.department),
    );
  }

  private loadRelationshipsOptions(): void {
    this.employeeService
      .query()
      .pipe(map((res: HttpResponse<IEmployee[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployee[]) =>
          this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(employees, this.employee?.manager),
        ),
      )
      .subscribe((employees: IEmployee[]) => this.employeesSharedCollection.set(employees));

    this.departmentService
      .query()
      .pipe(map((res: HttpResponse<IDepartment[]>) => res.body ?? []))
      .pipe(
        map((departments: IDepartment[]) =>
          this.departmentService.addDepartmentToCollectionIfMissing<IDepartment>(departments, this.employee?.department),
        ),
      )
      .subscribe((departments: IDepartment[]) => this.departmentsSharedCollection.set(departments));
  }
}
