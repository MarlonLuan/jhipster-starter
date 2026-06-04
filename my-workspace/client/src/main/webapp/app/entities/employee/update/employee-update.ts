import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDepartment } from 'app/entities/department/department.model';
import { DepartmentService } from 'app/entities/department/service/department.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IEmployee } from '../employee.model';
import { EmployeeService } from '../service/employee.service';

import { EmployeeFormGroup, EmployeeFormService } from './employee-form.service';

@Component({
  selector: 'jhi-employee-update',
  templateUrl: './employee-update.html',
  imports: [TranslateDirective, TranslateModule, NgbModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class EmployeeUpdate implements OnInit {
  isSaving = signal(false);
  employee: IEmployee | null = null;

  employeesSharedCollection = signal<IEmployee[]>([]);
  departmentsSharedCollection = signal<IDepartment[]>([]);

  protected employeeService = inject(EmployeeService);
  protected employeeFormService = inject(EmployeeFormService);
  protected departmentService = inject(DepartmentService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EmployeeFormGroup = this.employeeFormService.createEmployeeFormGroup();

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
    const employee = this.employeeFormService.getEmployee(this.editForm);
    if (employee.id === null) {
      this.subscribeToSaveResponse(this.employeeService.create(employee));
    } else {
      this.subscribeToSaveResponse(this.employeeService.update(employee));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmployee>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving.set(false);
  }

  protected updateForm(employee: IEmployee): void {
    this.employee = employee;
    this.employeeFormService.resetForm(this.editForm, employee);

    this.employeesSharedCollection.set(
      this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(this.employeesSharedCollection(), employee.manager),
    );
    this.departmentsSharedCollection.set(
      this.departmentService.addDepartmentToCollectionIfMissing<IDepartment>(this.departmentsSharedCollection(), employee.department),
    );
  }

  protected loadRelationshipsOptions(): void {
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
